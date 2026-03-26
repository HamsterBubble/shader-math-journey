precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // TODO: 画多条不同频率的 sin 波叠加
  // 提示: y = A1*sin(f1*x + t) + A2*sin(f2*x + t*1.5) + ...

  // TODO: 画示波器网格线（等距水平线和垂直线）

  // TODO: 用时间偏移让波纹滚动

  vec3 color = vec3(0.02, 0.05, 0.02);
  gl_FragColor = vec4(color, 1.0);
}
