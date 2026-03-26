precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 利萨如参数
  float A = 0.8;
  float B = 0.8;
  float a = 3.0;  // x 频率
  float b = 2.0;  // y 频率
  float delta = u_time * 0.5;  // 相位差随时间变化

  // 画利萨如曲线：遍历参数 t
  float minDist = 1.0;
  for (float i = 0.0; i < 200.0; i++) {
    float t = i / 200.0 * 6.2832;
    vec2 p = vec2(A * sin(a * t + delta), B * sin(b * t));
    minDist = min(minDist, length(uv - p));
  }

  float line = smoothstep(0.02, 0.005, minDist);
  float glow = exp(-minDist * 8.0) * 0.4;

  vec3 color = vec3(0.03, 0.03, 0.08);
  color += vec3(0.3, 0.8, 1.0) * line;
  color += vec3(0.2, 0.5, 0.8) * glow;

  gl_FragColor = vec4(color, 1.0);
}
