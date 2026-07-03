precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

vec3 screenBlend(vec3 a, vec3 b) {
  // TODO: 实现 Screen 滤色公式
  return mix(a, b, 0.5);
}

float glow(vec2 p, vec2 center, float size) {
  // TODO: 用 exp(-distance^2 * size) 生成柔和光晕
  return 0.0;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  vec3 color = vec3(0.03, 0.04, 0.08);

  // TODO: 叠加 3 个彩色 glow

  gl_FragColor = vec4(color, 1.0);
}
