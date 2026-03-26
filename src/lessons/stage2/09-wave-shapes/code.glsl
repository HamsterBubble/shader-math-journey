precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// 波形函数
float sawWave(float x) { return fract(x); }
float triWave(float x) { return abs(fract(x) * 2.0 - 1.0); }
float squareWave(float x) { return step(0.5, fract(x)); }

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float t = uv.x * 3.0 + u_time;

  // 四种波形 (从上到下排列)
  float yOffset = 0.6;
  float gap = 0.4;

  // sin (顶部)
  float s = sin(t * 3.14159) * 0.15;
  float lineSin = smoothstep(0.01, 0.0, abs(uv.y - yOffset - s));

  // 三角波
  float tri = triWave(t) * 0.3 - 0.15;
  float lineTri = smoothstep(0.01, 0.0, abs(uv.y - (yOffset - gap) - tri));

  // 锯齿波
  float saw = sawWave(t) * 0.3 - 0.15;
  float lineSaw = smoothstep(0.01, 0.0, abs(uv.y - (yOffset - gap * 2.0) - saw));

  // 方波
  float sq = squareWave(t) * 0.3 - 0.15;
  float lineSq = smoothstep(0.01, 0.0, abs(uv.y - (yOffset - gap * 3.0) - sq));

  vec3 color = vec3(0.03);
  color += vec3(0.3, 0.6, 1.0) * lineSin;
  color += vec3(0.3, 0.9, 0.4) * lineTri;
  color += vec3(1.0, 0.6, 0.2) * lineSaw;
  color += vec3(0.9, 0.3, 0.5) * lineSq;

  // 零线参考
  for (int i = 0; i < 4; i++) {
    float y = yOffset - float(i) * gap;
    color += vec3(0.08) * smoothstep(0.003, 0.0, abs(uv.y - y));
  }

  gl_FragColor = vec4(color, 1.0);
}
