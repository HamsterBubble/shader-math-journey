precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  // TODO: 插值四个格点 hash
  return hash(floor(p));
}

float fbm(vec2 p) {
  // TODO: 叠加多层 noise
  return noise(p);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  vec3 color = vec3(0.02, 0.03, 0.06);

  // TODO: 添加雾密度
  // TODO: 添加生命周期粒子

  gl_FragColor = vec4(color, 1.0);
}
