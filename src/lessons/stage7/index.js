/**
 * Stage 7 lessons
 * Auto-generated — edit individual lesson folders, not this file.
 */
import { meta as lesson01Meta } from './01-random-noise/meta.js';
import lesson01Instructions from './01-random-noise/instructions.html?raw';
import lesson01Code from './01-random-noise/code.glsl?raw';

import { meta as lesson02Meta } from './02-fbm-fractal/meta.js';
import lesson02Instructions from './02-fbm-fractal/instructions.html?raw';
import lesson02Code from './02-fbm-fractal/code.glsl?raw';

import { meta as lesson03Meta } from './03-phong-lighting/meta.js';
import lesson03Instructions from './03-phong-lighting/instructions.html?raw';
import lesson03Code from './03-phong-lighting/code.glsl?raw';

import { meta as lesson04Meta } from './04-hsv-color/meta.js';
import lesson04Instructions from './04-hsv-color/instructions.html?raw';
import lesson04Code from './04-hsv-color/code.glsl?raw';

import { meta as lesson05Meta } from './05-worley-cellular/meta.js';
import lesson05Instructions from './05-worley-cellular/instructions.html?raw';
import lesson05Code from './05-worley-cellular/code.glsl?raw';

import { meta as lesson06Meta } from './06-domain-warping/meta.js';
import lesson06Instructions from './06-domain-warping/instructions.html?raw';
import lesson06Code from './06-domain-warping/code.glsl?raw';

import { meta as lesson07Meta } from './07-challenge-raymarching/meta.js';
import lesson07Instructions from './07-challenge-raymarching/instructions.html?raw';
import lesson07Code from './07-challenge-raymarching/code.glsl?raw';
import lesson07Goal from './07-challenge-raymarching/goal.glsl?raw';

import { meta as lesson08Meta } from './08-challenge-plasma/meta.js';
import lesson08Instructions from './08-challenge-plasma/instructions.html?raw';
import lesson08Code from './08-challenge-plasma/code.glsl?raw';
import lesson08Goal from './08-challenge-plasma/goal.glsl?raw';

import { meta as lesson09Meta } from './09-challenge-starfield/meta.js';
import lesson09Instructions from './09-challenge-starfield/instructions.html?raw';
import lesson09Code from './09-challenge-starfield/code.glsl?raw';
import lesson09Goal from './09-challenge-starfield/goal.glsl?raw';

import { meta as lesson10Meta } from './10-simplex-noise/meta.js';
import lesson10Instructions from './10-simplex-noise/instructions.html?raw';
import lesson10Code from './10-simplex-noise/code.glsl?raw';

import { meta as lesson11Meta } from './11-voronoi-advanced/meta.js';
import lesson11Instructions from './11-voronoi-advanced/instructions.html?raw';
import lesson11Code from './11-voronoi-advanced/code.glsl?raw';

import { meta as lesson12Meta } from './12-color-grading/meta.js';
import lesson12Instructions from './12-color-grading/instructions.html?raw';
import lesson12Code from './12-color-grading/code.glsl?raw';

import { meta as lesson13Meta } from './13-challenge-ocean/meta.js';
import lesson13Instructions from './13-challenge-ocean/instructions.html?raw';
import lesson13Code from './13-challenge-ocean/code.glsl?raw';
import lesson13Goal from './13-challenge-ocean/goal.glsl?raw';

import { meta as lesson14Meta } from './14-challenge-galaxy/meta.js';
import lesson14Instructions from './14-challenge-galaxy/instructions.html?raw';
import lesson14Code from './14-challenge-galaxy/code.glsl?raw';
import lesson14Goal from './14-challenge-galaxy/goal.glsl?raw';

import { meta as lesson15Meta } from './15-texture-sample/meta.js';
import lesson15Instructions from './15-texture-sample/instructions.html?raw';
import lesson15Code from './15-texture-sample/code.glsl?raw';

import { meta as lesson16Meta } from './16-particle-life/meta.js';
import lesson16Instructions from './16-particle-life/instructions.html?raw';
import lesson16Code from './16-particle-life/code.glsl?raw';

import { meta as lesson17Meta } from './17-noise-texture/meta.js';
import lesson17Instructions from './17-noise-texture/instructions.html?raw';
import lesson17Code from './17-noise-texture/code.glsl?raw';

import { meta as lesson18Meta } from './18-render-to-texture/meta.js';
import lesson18Instructions from './18-render-to-texture/instructions.html?raw';
import lesson18Code from './18-render-to-texture/code.glsl?raw';

import { meta as lesson19Meta } from './19-challenge-particle-fog/meta.js';
import lesson19Instructions from './19-challenge-particle-fog/instructions.html?raw';
import lesson19Code from './19-challenge-particle-fog/code.glsl?raw';
import lesson19Goal from './19-challenge-particle-fog/goal.glsl?raw';

import { meta as lesson20Meta } from './20-challenge-dragon-flame/meta.js';
import lesson20Instructions from './20-challenge-dragon-flame/instructions.html?raw';
import lesson20Code from './20-challenge-dragon-flame/code.glsl?raw';
import lesson20Goal from './20-challenge-dragon-flame/goal.glsl?raw';

export const stage7 = [
  // ── 噪声基础 ──
  { ...lesson01Meta, instructions: lesson01Instructions, code: lesson01Code },       // 01 伪随机 & 噪声
  { ...lesson18Meta, instructions: lesson18Instructions, code: lesson18Code },       // 02 渲染到纹理（概念）
  { ...lesson15Meta, instructions: lesson15Instructions, code: lesson15Code },       // 03 纹理采样模拟
  { ...lesson16Meta, instructions: lesson16Instructions, code: lesson16Code },       // 04 粒子生命衰减
  { ...lesson02Meta, instructions: lesson02Instructions, code: lesson02Code },       // 05 FBM 分形噪声
  { ...lesson17Meta, instructions: lesson17Instructions, code: lesson17Code },       // 06 噪声雾效
  // ── 颜色与光照 ──
  { ...lesson04Meta, instructions: lesson04Instructions, code: lesson04Code },       // 03 HSV 颜色空间
  { ...lesson03Meta, instructions: lesson03Instructions, code: lesson03Code },       // 04 Phong 光照模型
  // ── 高级噪声 ──
  { ...lesson05Meta, instructions: lesson05Instructions, code: lesson05Code },       // 05 Worley 细胞噪声
  { ...lesson06Meta, instructions: lesson06Instructions, code: lesson06Code },       // 06 域扭曲噪声
  { ...lesson10Meta, instructions: lesson10Instructions, code: lesson10Code },       // 07 Simplex 噪声
  { ...lesson11Meta, instructions: lesson11Instructions, code: lesson11Code },       // 08 高级 Voronoi 纹理
  { ...lesson12Meta, instructions: lesson12Instructions, code: lesson12Code },       // 09 电影级色彩分级
  // ── 综合挑战 ──
  { ...lesson07Meta, instructions: lesson07Instructions, code: lesson07Code, goalCode: lesson07Goal },   // 10 🏆 终极: Ray Marching
  { ...lesson08Meta, instructions: lesson08Instructions, code: lesson08Code, goalCode: lesson08Goal },   // 11 🏆 等离子体
  { ...lesson09Meta, instructions: lesson09Instructions, code: lesson09Code, goalCode: lesson09Goal },   // 12 🏆 星空隧道
  { ...lesson13Meta, instructions: lesson13Instructions, code: lesson13Code, goalCode: lesson13Goal },   // 13 🏆 程序化海洋
  { ...lesson14Meta, instructions: lesson14Instructions, code: lesson14Code, goalCode: lesson14Goal },   // 14 🏆 银河旋臂
  { ...lesson19Meta, instructions: lesson19Instructions, code: lesson19Code, goalCode: lesson19Goal },   // 15 🏆 粒子雾场
  { ...lesson20Meta, instructions: lesson20Instructions, code: lesson20Code, goalCode: lesson20Goal },   // 16 🏆 火焰粒子
];
