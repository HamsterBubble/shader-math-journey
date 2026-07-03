#!/usr/bin/env node
/**
 * 同步 Dracarys 静态资源到 public 根目录（/gl、/audio、/three）
 * Dracarys 构建物硬编码了根路径，需复制或代理才能加载模型与音频。
 */
import { cpSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'public', 'cases', 'dracarys');

if (!existsSync(join(src, 'index.html'))) {
  console.warn('跳过 Dracarys 资源同步：缺少 public/cases/dracarys/index.html');
  process.exit(0);
}

for (const dir of ['gl', 'audio', 'three']) {
  const from = join(src, dir);
  const to = join(root, 'public', dir);
  if (!existsSync(from)) {
    console.warn(`跳过 ${dir}（不存在）`);
    continue;
  }
  if (existsSync(to)) rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
  console.log(`synced ${dir}/`);
}

console.log('Dracarys 资源同步完成');
