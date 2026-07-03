#!/usr/bin/env node
/** 生成案例专属知识点静态页（精简版） */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const pages = [
  {
    file: 'learn-ndc-coords.html',
    title: '🖱️ NDC 标准化设备坐标',
    body: `
      <p>鼠标事件给出的是<strong>屏幕像素坐标</strong>；Shader 和 Raycaster 使用的是 <strong>NDC（Normalized Device Coordinates）</strong>，范围通常为 [-1, 1]。</p>
      <div class="card"><h4>转换公式</h4>
      <pre><code>ndc.x = (clientX - rect.left) / rect.width  * 2.0 - 1.0
ndc.y = -((clientY - rect.top)  / rect.height * 2.0 - 1.0)</code></pre>
      <p>Y 轴取反：屏幕坐标原点在左上，NDC 原点在中心且 Y 向上。</p></div>
      <p>Dracarys 中 <code>mouseNDC</code> 驱动龙身交互与后处理鼠标轨迹。</p>`,
  },
  {
    file: 'learn-texture-sample.html',
    title: '🗂️ 纹理采样 texture2D',
    body: `
      <p>多 pass 管线把上一帧结果写入纹理，下一 pass 用 <code>texture2D(sampler, uv)</code> 读取。</p>
      <div class="card"><h4>水面 / GPGPU 典型用法</h4>
      <pre><code>vec4 north = texture2D(uTex, uv + vec2(0.0, cellSize.y));
float h = north.x; // 邻域高度</code></pre></div>
      <p>与单屏 fragment 不同：纹理是<strong>跨像素、跨帧</strong>传递状态的载体。</p>`,
  },
  {
    file: 'learn-wave-equation.html',
    title: '〰️ 水面波动方程',
    body: `
      <p>简化波动：当前像素高度由<strong>四邻域平均</strong>与上一帧速度决定，形成涟漪扩散。</p>
      <div class="card"><h4>核心思路</h4>
      <pre><code>newH = (N+S+E+W)*0.5 - prevVel;
vel = newH - oldH;</code></pre>
      <p>鼠标点击可叠加 <code>cos</code> 相位鼓包作为激励源。</p></div>`,
  },
  {
    file: 'learn-normal-map.html',
    title: '🗺️ 法线贴图扰动 UV',
    body: `
      <p>法线贴图 RGB 编码表面微观法线。采样后偏移反射/折射 UV，实现<strong>镜面细节</strong>而无额外几何。</p>
      <div class="card"><h4>常见步骤</h4>
      <ol><li>采样法线并映射到 [-1,1]</li><li>与切线空间或屏幕空间结合</li><li>扰动采样坐标 <code>uv + normal.xy * strength</code></li></ol></div>`,
  },
  {
    file: 'learn-gpgpu-particles.html',
    title: '✨ GPGPU 粒子模拟',
    body: `
      <p>粒子状态存在纹理里：RGB=位置/速度，A=生命。每帧用全屏 quad 跑两个 pass 更新速度与位置。</p>
      <div class="card"><h4>速度 pass 常见力</h4>
      <ul><li>弹簧：拉回表面归属点</li><li>阻尼：速度衰减</li><li>鼠标推开：径向力</li></ul></div>`,
  },
  {
    file: 'learn-particle-life.html',
    title: '💫 粒子生命周期',
    body: `
      <p>粒子 alpha 通道存<strong>生命值</strong>。每帧递减；低于阈值则重生到发射器表面随机点。</p>
      <p>火焰粒子还需在渲染 pass 根据 life 混合颜色与尺寸，形成「起—燃—熄」。</p>`,
  },
  {
    file: 'learn-barrel-distortion.html',
    title: '🔭 桶形畸变 Barrel Distortion',
    body: `
      <p>沿径向推拉 UV，模拟镜头边缘弯曲：</p>
      <div class="card"><pre><code>vec2 cc = uv - 0.5;
float d = dot(cc, cc);
uv = uv + cc * d * strength;</code></pre></div>
      <p>Dracarys Master pass 在慢动作时加强畸变，强化镜头感。</p>`,
  },
  {
    file: 'learn-blend-screen.html',
    title: '💡 Screen 滤色混合',
    body: `
      <p>Screen 公式：<code>1 - (1-a)*(1-b)</code>，两色叠加强调亮部，适合光晕、火焰、高光。</p>
      <div class="card"><pre><code>vec3 screen(vec3 a, vec3 b) {
  return 1.0 - (1.0 - a) * (1.0 - b);
}</code></pre></div>`,
  },
  {
    file: 'learn-noise-texture.html',
    title: '🌫️ 噪声纹理采样',
    body: `
      <p>预烘焙 FBM / Perlin 噪声图，在 Shader 中按 UV+时间偏移采样，驱动雾密度、闪烁与扰动。</p>
      <p>比实时纯数学噪声更省，适合全屏后处理与大面积氛围。</p>`,
  },
];

const shell = (title, body) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0d1117;color:#e6edf3;font-family:Inter,-apple-system,sans-serif;line-height:1.7;padding:32px 20px 60px}
.container{max-width:720px;margin:0 auto}
h1{font-size:1.5rem;color:#58a6ff;margin-bottom:1rem}
p,li{color:#8b949e;margin-bottom:.75rem;font-size:.92rem}
strong{color:#e6edf3}
code,pre{font-family:'JetBrains Mono',monospace;background:rgba(255,255,255,.06);border-radius:4px}
code{padding:2px 6px;color:#58a6ff;font-size:.88rem}
pre{padding:14px;overflow-x:auto;margin:.75rem 0;font-size:.82rem;line-height:1.5}
.card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:18px;margin:16px 0}
.card h4{color:#39d2c0;margin-bottom:10px}
ol,ul{padding-left:1.25rem}
.badge{display:inline-block;font-size:.7rem;background:rgba(255,180,80,.15);color:#ffb84d;padding:2px 8px;border-radius:4px;margin-bottom:12px}
</style>
</head>
<body>
<div class="container">
<span class="badge">案例专属知识点</span>
<h1>${title}</h1>
${body}
</div>
</body>
</html>`;

for (const p of pages) {
  writeFileSync(join(out, p.file), shell(p.title, p.body), 'utf8');
  console.log('wrote', p.file);
}
