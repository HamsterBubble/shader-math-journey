/**
 * Stage 1 lessons
 * Auto-generated — edit individual lesson folders, not this file.
 */
import { meta as lesson01Meta } from './01-hello-gradient/meta.js';
import lesson01Instructions from './01-hello-gradient/instructions.html?raw';
import lesson01Code from './01-hello-gradient/code.glsl?raw';

import { meta as lesson02Meta } from './02-mix-colors/meta.js';
import lesson02Instructions from './02-mix-colors/instructions.html?raw';
import lesson02Code from './02-mix-colors/code.glsl?raw';

import { meta as lesson03Meta } from './03-step-function/meta.js';
import lesson03Instructions from './03-step-function/instructions.html?raw';
import lesson03Code from './03-step-function/code.glsl?raw';

import { meta as lesson04Meta } from './04-smoothstep-compare/meta.js';
import lesson04Instructions from './04-smoothstep-compare/instructions.html?raw';
import lesson04Code from './04-smoothstep-compare/code.glsl?raw';

import { meta as lesson05Meta } from './05-fract-repeat/meta.js';
import lesson05Instructions from './05-fract-repeat/instructions.html?raw';
import lesson05Code from './05-fract-repeat/code.glsl?raw';

import { meta as lesson06Meta } from './06-circle-sdf/meta.js';
import lesson06Instructions from './06-circle-sdf/instructions.html?raw';
import lesson06Code from './06-circle-sdf/code.glsl?raw';

import { meta as lesson07Meta } from './07-animation-time/meta.js';
import lesson07Instructions from './07-animation-time/instructions.html?raw';
import lesson07Code from './07-animation-time/code.glsl?raw';

import { meta as lesson08Meta } from './08-abs-mod/meta.js';
import lesson08Instructions from './08-abs-mod/instructions.html?raw';
import lesson08Code from './08-abs-mod/code.glsl?raw';

import { meta as lesson09Meta } from './09-clamp-remap/meta.js';
import lesson09Instructions from './09-clamp-remap/instructions.html?raw';
import lesson09Code from './09-clamp-remap/code.glsl?raw';

import { meta as lesson10Meta } from './10-pow-exp/meta.js';
import lesson10Instructions from './10-pow-exp/instructions.html?raw';
import lesson10Code from './10-pow-exp/code.glsl?raw';

import { meta as lesson11Meta } from './11-min-max-shapes/meta.js';
import lesson11Instructions from './11-min-max-shapes/instructions.html?raw';
import lesson11Code from './11-min-max-shapes/code.glsl?raw';

import { meta as lesson12Meta } from './12-color-math/meta.js';
import lesson12Instructions from './12-color-math/instructions.html?raw';
import lesson12Code from './12-color-math/code.glsl?raw';

import { meta as lesson13Meta } from './13-challenge-pattern/meta.js';
import lesson13Instructions from './13-challenge-pattern/instructions.html?raw';
import lesson13Code from './13-challenge-pattern/code.glsl?raw';
import lesson13Goal from './13-challenge-pattern/goal.glsl?raw';

import { meta as lesson14Meta } from './14-sign-function/meta.js';
import lesson14Instructions from './14-sign-function/instructions.html?raw';
import lesson14Code from './14-sign-function/code.glsl?raw';

import { meta as lesson15Meta } from './15-floor-ceil/meta.js';
import lesson15Instructions from './15-floor-ceil/instructions.html?raw';
import lesson15Code from './15-floor-ceil/code.glsl?raw';

import { meta as lesson16Meta } from './16-ternary-select/meta.js';
import lesson16Instructions from './16-ternary-select/instructions.html?raw';
import lesson16Code from './16-ternary-select/code.glsl?raw';

import { meta as lesson17Meta } from './17-challenge-checkerboard/meta.js';
import lesson17Instructions from './17-challenge-checkerboard/instructions.html?raw';
import lesson17Code from './17-challenge-checkerboard/code.glsl?raw';
import lesson17Goal from './17-challenge-checkerboard/goal.glsl?raw';

import { meta as lesson18Meta } from './18-challenge-sunrise/meta.js';
import lesson18Instructions from './18-challenge-sunrise/instructions.html?raw';
import lesson18Code from './18-challenge-sunrise/code.glsl?raw';
import lesson18Goal from './18-challenge-sunrise/goal.glsl?raw';

export const stage1 = [
  // ── 基础入门：UV 与单值函数 ──
  { ...lesson01Meta, instructions: lesson01Instructions, code: lesson01Code },       // 01 你好，渐变！
  { ...lesson02Meta, instructions: lesson02Instructions, code: lesson02Code },       // 02 mix() 颜色混合
  { ...lesson03Meta, instructions: lesson03Instructions, code: lesson03Code },       // 03 step() 硬边界
  { ...lesson04Meta, instructions: lesson04Instructions, code: lesson04Code },       // 04 smoothstep() 平滑过渡
  // ── 几何与距离：先学 length/SDF，后续课才能用 ──
  { ...lesson06Meta, instructions: lesson06Instructions, code: lesson06Code },       // 05 画一个圆 (SDF) — length() 基础
  { ...lesson07Meta, instructions: lesson07Instructions, code: lesson07Code },       // 06 u_time 动画
  { ...lesson08Meta, instructions: lesson08Instructions, code: lesson08Code },       // 07 abs() 与 mod()
  { ...lesson05Meta, instructions: lesson05Instructions, code: lesson05Code },       // 08 fract() 重复图案 — 有了圆的基础
  { ...lesson15Meta, instructions: lesson15Instructions, code: lesson15Code },       // 09 floor/ceil — 与 fract 搭配
  // ── 数值工具 ──
  { ...lesson09Meta, instructions: lesson09Instructions, code: lesson09Code },       // 10 clamp() 与值域映射
  { ...lesson10Meta, instructions: lesson10Instructions, code: lesson10Code },       // 11 pow() 与 exp()
  { ...lesson11Meta, instructions: lesson11Instructions, code: lesson11Code },       // 12 min()/max() 造形
  // ── 进阶函数 ──
  { ...lesson14Meta, instructions: lesson14Instructions, code: lesson14Code },       // 13 符号函数 sign()
  { ...lesson16Meta, instructions: lesson16Instructions, code: lesson16Code },       // 14 条件选择：三元替代
  { ...lesson12Meta, instructions: lesson12Instructions, code: lesson12Code },       // 15 RGB 颜色数学
  // ── 综合挑战 ──
  { ...lesson13Meta, instructions: lesson13Instructions, code: lesson13Code, goalCode: lesson13Goal },   // 16 🏆 创意图案
  { ...lesson17Meta, instructions: lesson17Instructions, code: lesson17Code, goalCode: lesson17Goal },   // 17 🏆 棋盘大师
  { ...lesson18Meta, instructions: lesson18Instructions, code: lesson18Code, goalCode: lesson18Goal },   // 18 🏆 日出渐变
];
