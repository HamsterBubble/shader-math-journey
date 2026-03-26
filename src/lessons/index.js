/**
 * Shader Math Journey — Lesson Registry
 * Auto-generated — edit individual lesson folders, not this file.
 */
import { stage1 } from './stage1/index.js';
import { stage2 } from './stage2/index.js';
import { stage3 } from './stage3/index.js';
import { stage4 } from './stage4/index.js';
import { stage5 } from './stage5/index.js';
import { stage6 } from './stage6/index.js';
import { stage7 } from './stage7/index.js';

export const stages = [
  { id: 1, title: '基础代数与函数', icon: '⭐', weeks: '2-3 周', difficulty: 1 },
  { id: 2, title: '三角函数',       icon: '🔺', weeks: '2-3 周', difficulty: 2 },
  { id: 3, title: '向量数学',       icon: '📐', weeks: '3-4 周', difficulty: 3 },
  { id: 4, title: '矩阵与线性代数', icon: '🧮', weeks: '3-4 周', difficulty: 3 },
  { id: 5, title: '坐标系统与几何', icon: '🌐', weeks: '2-3 周', difficulty: 3 },
  { id: 6, title: '微积分入门',     icon: '∫',  weeks: '2-3 周', difficulty: 4 },
  { id: 7, title: 'Shader专项数学', icon: '🎆', weeks: '3-4 周', difficulty: 4 },
];

export const lessons = [
  ...stage1,
  ...stage2,
  ...stage3,
  ...stage4,
  ...stage5,
  ...stage6,
  ...stage7,
];
