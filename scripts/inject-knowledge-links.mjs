/**
 * inject-knowledge-links.mjs
 *
 * Scans all lesson code.glsl files for known patterns,
 * then injects matching knowledge-link tags into instructions.html.
 *
 * Knowledge Point Registry:
 *   Each entry maps a concept → { page, title, label, patterns[] }
 *   patterns are strings to grep for in code.glsl
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const lessonsDir = path.resolve(__dirname, '../src/lessons');

// ══════════════════════════════════════════════
//  KNOWLEDGE POINT REGISTRY
// ══════════════════════════════════════════════
const KNOWLEDGE_POINTS = [
  {
    id: 'uv-remap',
    page: '/learn-uv-remap.html',
    title: '坐标居中：uv × 2 − 1',
    label: '坐标居中原理',
    icon: '📐',
    // Match code.glsl patterns (any match triggers injection)
    patterns: ['uv * 2.0 - 1.0', 'uv*2.0-1.0', '* 2.0 - 1.0', 'uv - 0.5', 'uv-0.5'],
  },
  {
    id: 'smoothstep',
    page: '/learn-smoothstep.html',
    title: 'smoothstep 平滑阶跃',
    label: 'smoothstep 原理',
    icon: '📈',
    patterns: ['smoothstep('],
  },
  {
    id: 'sdf-basics',
    page: '/learn-sdf-basics.html',
    title: 'SDF 有符号距离函数',
    label: 'SDF 基础',
    icon: '⭕',
    patterns: ['length(uv', 'length(p', '- radius', '- r;', '- r)'],
  },
  {
    id: 'sin-cos',
    page: '/learn-sin-cos.html',
    title: 'sin/cos 三角函数',
    label: 'sin/cos 波形',
    icon: '🌊',
    patterns: ['sin(', 'cos('],
  },
  {
    id: 'mix-blend',
    page: '/learn-mix-blend.html',
    title: 'mix 颜色混合与插值',
    label: 'mix 混合原理',
    icon: '🎨',
    patterns: ['mix('],
  },
  {
    id: 'dot-product',
    page: '/learn-dot-product.html',
    title: 'dot 点积运算',
    label: '点积原理',
    icon: '🔘',
    patterns: ['dot('],
  },
  {
    id: 'matrix-transform',
    page: '/learn-matrix-transform.html',
    title: '矩阵变换：旋转/缩放/剪切',
    label: '矩阵变换',
    icon: '🔄',
    patterns: ['mat2(', 'mat2 ', 'mat3(', 'mat3 '],
  },
  {
    id: 'polar-coords',
    page: '/learn-polar-coords.html',
    title: '极坐标：atan 与 length',
    label: '极坐标系',
    icon: '🎯',
    patterns: ['atan('],
  },
  {
    id: 'fract-repeat',
    page: '/learn-fract-repeat.html',
    title: 'fract 取小数与图案重复',
    label: 'fract 重复',
    icon: '🔁',
    patterns: ['fract('],
  },
];

// ══════════════════════════════════════════════
//  SKIP RULES: Don't inject a concept
//  into the lesson that *teaches* it
// ══════════════════════════════════════════════
const SKIP_MAP = {
  'uv-remap':        ['stage1/01-hello-gradient', 'stage1/09-clamp-remap'],
  'smoothstep':      ['stage1/04-smoothstep-compare'],
  'sdf-basics':      ['stage1/06-circle-sdf'],
  'sin-cos':         ['stage2/01-sin-wave', 'stage2/02-sin-cos-circle'],
  'mix-blend':       ['stage1/02-mix-colors'],
  'dot-product':     ['stage3/03-dot-product'],
  'matrix-transform':['stage4/01-rotate2d'],
  'polar-coords':    ['stage2/03-polar-coords', 'stage2/07-atan2-angle'],
  'fract-repeat':    ['stage1/05-fract-repeat'],
};

function buildTag(kp) {
  return `<a class="knowledge-link" data-page="${kp.page}" data-title="${kp.title}"><span class="kl-icon">${kp.icon}</span><span class="kl-text">${kp.label}</span></a>`;
}

let totalInjected = 0;
let totalSkipped = 0;

// Walk all stage dirs
const stages = fs.readdirSync(lessonsDir)
  .filter(d => d.startsWith('stage') && fs.statSync(path.join(lessonsDir, d)).isDirectory())
  .sort();

for (const stage of stages) {
  const stageDir = path.join(lessonsDir, stage);
  const lessons = fs.readdirSync(stageDir)
    .filter(d => fs.statSync(path.join(stageDir, d)).isDirectory())
    .sort();

  for (const lesson of lessons) {
    const lessonDir = path.join(stageDir, lesson);
    const codeFile = path.join(lessonDir, 'code.glsl');
    const instrFile = path.join(lessonDir, 'instructions.html');

    if (!fs.existsSync(codeFile) || !fs.existsSync(instrFile)) continue;

    const code = fs.readFileSync(codeFile, 'utf-8');
    let html = fs.readFileSync(instrFile, 'utf-8');

    // Determine which knowledge points this lesson uses
    const matchingTags = [];

    for (const kp of KNOWLEDGE_POINTS) {
      // Skip if this lesson teaches this concept
      const skipList = SKIP_MAP[kp.id] || [];
      const lessonKey = `${stage}/${lesson}`;
      if (skipList.some(s => lessonKey.includes(s))) continue;

      // Check if any pattern matches
      const matches = kp.patterns.some(p => code.includes(p));
      if (!matches) continue;

      matchingTags.push(buildTag(kp));
    }

    if (matchingTags.length === 0) continue;

    // Remove any existing knowledge-tags <p> (to rebuild cleanly)
    html = html.replace(/<p class="knowledge-tags">[\s\S]*?<\/p>\n?/g, '');

    // Find the first </h2> and insert after it
    const h2CloseIdx = html.indexOf('</h2>');
    if (h2CloseIdx === -1) {
      console.log(`  ⚠ No <h2> in ${stage}/${lesson} — skipping`);
      continue;
    }

    const insertPos = h2CloseIdx + '</h2>'.length;
    const before = html.slice(0, insertPos);
    const after = html.slice(insertPos);
    const injection = `\n<p class="knowledge-tags">${matchingTags.join('')}</p>\n`;
    html = before + injection + after;

    fs.writeFileSync(instrFile, html, 'utf-8');
    totalInjected++;
    console.log(`  ✅ ${stage}/${lesson} → ${matchingTags.length} tags`);
  }
}

console.log(`\n✨ Done! Lessons updated: ${totalInjected}, Tags skipped (already present): ${totalSkipped}`);
