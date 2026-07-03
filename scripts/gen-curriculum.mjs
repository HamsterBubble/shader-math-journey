/**
 * gen-curriculum.mjs
 *
 * Scans lesson meta.js files under src/lessons and regenerates docs/CURRICULUM.md.
 * Run: npm run docs:curriculum
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const lessonsDir = path.join(root, 'src/lessons');
const outFile = path.join(root, 'docs/CURRICULUM.md');

function parseStages() {
  const src = fs.readFileSync(path.join(lessonsDir, 'index.js'), 'utf-8');
  const stages = {};
  for (const m of src.matchAll(/\{\s*id:\s*(\d+),\s*title:\s*'([^']+)'/g)) {
    stages[+m[1]] = m[2];
  }
  return stages;
}

function parseMeta(metaPath) {
  const src = fs.readFileSync(metaPath, 'utf-8');
  const pick = (key) => src.match(new RegExp(`${key}:\\s*['"]([^'"]+)['"]`))?.[1];
  return {
    id: pick('id'),
    stage: pick('stage') ? +pick('stage') : null,
    title: pick('title'),
    badge: pick('badge'),
  };
}

const stages = parseStages();
const rows = [];

const stageDirs = fs.readdirSync(lessonsDir)
  .filter((d) => /^stage\d+$/.test(d))
  .sort((a, b) => +a.slice(5) - +b.slice(5));

for (const stageDir of stageDirs) {
  const stageNum = +stageDir.slice(5);
  const stagePath = path.join(lessonsDir, stageDir);
  const lessonDirs = fs.readdirSync(stagePath)
    .filter((d) => fs.statSync(path.join(stagePath, d)).isDirectory())
    .sort();

  for (const slug of lessonDirs) {
    const lessonPath = path.join(stagePath, slug);
    const metaPath = path.join(lessonPath, 'meta.js');
    if (!fs.existsSync(metaPath)) continue;

    const meta = parseMeta(metaPath);
    const hasGoal = fs.existsSync(path.join(lessonPath, 'goal.glsl'));
    const type = meta.badge === '挑战' || hasGoal ? 'challenge' : 'lesson';

    rows.push({
      id: meta.id ?? slug,
      stage: meta.stage ?? stageNum,
      stageTitle: stages[meta.stage ?? stageNum] ?? `阶段 ${stageNum}`,
      title: meta.title ?? slug,
      badge: meta.badge ?? '',
      type,
      path: `${stageDir}/${slug}`,
    });
  }
}

const lessonCount = rows.filter((r) => r.type === 'lesson').length;
const challengeCount = rows.filter((r) => r.type === 'challenge').length;
const generatedAt = new Date().toISOString().slice(0, 10);

const lines = [
  '# 课程索引',
  '',
  '> 自动生成 — 运行 `npm run docs:curriculum` 更新。勿手改。',
  '',
  `共 **${rows.length}** 条目：${lessonCount} 节课程 + ${challengeCount} 个挑战。`,
  '',
  '## 按阶段',
  '',
];

for (const stageNum of [...new Set(rows.map((r) => r.stage))].sort((a, b) => a - b)) {
  const stageRows = rows.filter((r) => r.stage === stageNum);
  lines.push(`### Stage ${stageNum} — ${stages[stageNum] ?? ''}`);
  lines.push('');
  lines.push('| id | 标题 | badge | 类型 | 路径 |');
  lines.push('|----|------|-------|------|------|');
  for (const r of stageRows) {
    lines.push(`| \`${r.id}\` | ${r.title} | ${r.badge} | ${r.type} | \`${r.path}\` |`);
  }
  lines.push('');
}

lines.push('## 全量速查（按路径排序）');
lines.push('');
lines.push('| id | stage | 类型 | 路径 |');
lines.push('|----|-------|------|------|');
for (const r of rows) {
  lines.push(`| \`${r.id}\` | ${r.stage} | ${r.type} | \`${r.path}\` |`);
}
lines.push('');
lines.push(`---`);
lines.push(`*Generated ${generatedAt} by scripts/gen-curriculum.mjs*`);

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, lines.join('\n'), 'utf-8');
console.log(`✅ Wrote ${outFile} (${rows.length} lessons)`);
