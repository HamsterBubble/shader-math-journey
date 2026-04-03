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

import { KNOWLEDGE_POINTS } from '../src/config/knowledge.js';

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
