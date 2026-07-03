precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

// 用 sin/fract 模拟纹理采样（无真实 sampler）
float samplePattern(vec2 uv) {
  vec2 grid = fract(uv * 12.0);
  float checker = mod(floor(uv.x * 12.0) + floor(uv.y * 12.0), 2.0);
  float wave = 0.5 + 0.5 * sin((uv.x + uv.y) * 24.0 + u_time);
  float dotMask = smoothstep(0.28, 0.24, length(grid - 0.5));
  return mix(checker, wave, 0.35) * 0.65 + dotMask * 0.35;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  float cellSize = 1.0 / 128.0;

  float center = samplePattern(uv);
  float north = samplePattern(uv + vec2(0.0, cellSize));
  float south = samplePattern(uv - vec2(0.0, cellSize));
  float east = samplePattern(uv + vec2(cellSize, 0.0));
  float west = samplePattern(uv - vec2(cellSize, 0.0));
  float blur = (north + south + east + west) * 0.25;
  vec2 gradient = vec2(east - west, north - south);

  vec3 base = mix(vec3(0.06, 0.08, 0.13), vec3(0.85, 0.9, 1.0), center);
  vec3 neighbor = vec3(0.5 + gradient.x * 3.0, 0.5 + gradient.y * 3.0, blur);
  vec3 color = mix(base, neighbor, step(0.5, gl_FragCoord.x / u_resolution.x));

  gl_FragColor = vec4(color, 1.0);
}
