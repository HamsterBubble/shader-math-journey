precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;
  // TODO: 画一个圆形护盾
  // TODO: 用菲涅尔做边缘发光
  // TODO: 用 sin 波纹从中心向外扩散
  // TODO: 六角网格纹理叠加
  vec3 color = vec3(0.02);
  gl_FragColor = vec4(color, 1.0);
}
