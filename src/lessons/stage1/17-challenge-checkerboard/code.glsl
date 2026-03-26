precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  float grid = 8.0;

  // TODO: 用 floor + mod 创建棋盘图案
  // float checker = mod(floor(uv.x * grid) + floor(uv.y * grid), 2.0);

  // TODO: 定义黑白格颜色

  // TODO: 加分 — 让格子缓慢旋转

  vec3 color = vec3(uv, 0.5);
  gl_FragColor = vec4(color, 1.0);
}
