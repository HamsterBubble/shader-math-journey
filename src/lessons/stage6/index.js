/**
 * Stage 6 lessons
 * Auto-generated — edit individual lesson folders, not this file.
 */
import { meta as lesson01Meta } from './01-derivative-slope/meta.js';
import lesson01Instructions from './01-derivative-slope/instructions.html?raw';
import lesson01Code from './01-derivative-slope/code.glsl?raw';

import { meta as lesson02Meta } from './02-normal-from-heightmap/meta.js';
import lesson02Instructions from './02-normal-from-heightmap/instructions.html?raw';
import lesson02Code from './02-normal-from-heightmap/code.glsl?raw';

import { meta as lesson03Meta } from './03-gradient-field/meta.js';
import lesson03Instructions from './03-gradient-field/instructions.html?raw';
import lesson03Code from './03-gradient-field/code.glsl?raw';

import { meta as lesson04Meta } from './04-dfdx-dfdy/meta.js';
import lesson04Instructions from './04-dfdx-dfdy/instructions.html?raw';
import lesson04Code from './04-dfdx-dfdy/code.glsl?raw';

import { meta as lesson05Meta } from './05-antialiasing/meta.js';
import lesson05Instructions from './05-antialiasing/instructions.html?raw';
import lesson05Code from './05-antialiasing/code.glsl?raw';

import { meta as lesson06Meta } from './06-challenge-normals-viz/meta.js';
import lesson06Instructions from './06-challenge-normals-viz/instructions.html?raw';
import lesson06Code from './06-challenge-normals-viz/code.glsl?raw';
import lesson06Goal from './06-challenge-normals-viz/goal.glsl?raw';

import { meta as lesson07Meta } from './07-challenge-fire/meta.js';
import lesson07Instructions from './07-challenge-fire/instructions.html?raw';
import lesson07Code from './07-challenge-fire/code.glsl?raw';
import lesson07Goal from './07-challenge-fire/goal.glsl?raw';

import { meta as lesson08Meta } from './08-edge-detection/meta.js';
import lesson08Instructions from './08-edge-detection/instructions.html?raw';
import lesson08Code from './08-edge-detection/code.glsl?raw';

import { meta as lesson09Meta } from './09-curvature/meta.js';
import lesson09Instructions from './09-curvature/instructions.html?raw';
import lesson09Code from './09-curvature/code.glsl?raw';

import { meta as lesson10Meta } from './10-laplacian/meta.js';
import lesson10Instructions from './10-laplacian/instructions.html?raw';
import lesson10Code from './10-laplacian/code.glsl?raw';

import { meta as lesson11Meta } from './11-challenge-toon-shading/meta.js';
import lesson11Instructions from './11-challenge-toon-shading/instructions.html?raw';
import lesson11Code from './11-challenge-toon-shading/code.glsl?raw';
import lesson11Goal from './11-challenge-toon-shading/goal.glsl?raw';

import { meta as lesson12Meta } from './12-challenge-heatmap/meta.js';
import lesson12Instructions from './12-challenge-heatmap/instructions.html?raw';
import lesson12Code from './12-challenge-heatmap/code.glsl?raw';
import lesson12Goal from './12-challenge-heatmap/goal.glsl?raw';

export const stage6 = [
  // ── 核心概念 ──
  { ...lesson01Meta, instructions: lesson01Instructions, code: lesson01Code },       // 01 导数 = 斜率
  { ...lesson02Meta, instructions: lesson02Instructions, code: lesson02Code },       // 02 法线计算
  { ...lesson03Meta, instructions: lesson03Instructions, code: lesson03Code },       // 03 梯度场
  { ...lesson04Meta, instructions: lesson04Instructions, code: lesson04Code },       // 04 GPU 导数函数
  { ...lesson05Meta, instructions: lesson05Instructions, code: lesson05Code },       // 05 抗锯齿原理
  // ── 进阶应用 ──
  { ...lesson08Meta, instructions: lesson08Instructions, code: lesson08Code },       // 06 边缘检测 (Sobel)
  { ...lesson09Meta, instructions: lesson09Instructions, code: lesson09Code },       // 07 曲率可视化
  { ...lesson10Meta, instructions: lesson10Instructions, code: lesson10Code },       // 08 拉普拉斯算子
  // ── 综合挑战 ──
  { ...lesson06Meta, instructions: lesson06Instructions, code: lesson06Code, goalCode: lesson06Goal },   // 09 🏆 法线可视化
  { ...lesson07Meta, instructions: lesson07Instructions, code: lesson07Code, goalCode: lesson07Goal },   // 10 🏆 火焰效果
  { ...lesson11Meta, instructions: lesson11Instructions, code: lesson11Code, goalCode: lesson11Goal },   // 11 🏆 卡通渲染
  { ...lesson12Meta, instructions: lesson12Instructions, code: lesson12Code, goalCode: lesson12Goal },   // 12 🏆 热力图
];
