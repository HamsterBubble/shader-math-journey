precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// Value Noise: 网格随机值 + 平滑插值
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  // smooth interpolation
  f = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  float n = noise(uv * 8.0 + u_time * 0.5);

  vec3 color = vec3(n);

  gl_FragColor = vec4(color, 1.0);
}
