precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 三个参数 — 试着改它们！
  float amp = 0.3;         // 振幅
  float freq = 6.0;        // 频率
  float phase = u_time * 2.0; // 相位 (随时间移动)

  // 波形
  float wave = amp * sin(freq * uv.x + phase);

  // 画波形线
  float line = smoothstep(0.015, 0.0, abs(uv.y - wave));

  // 第二条波 — 不同频率和相位
  float wave2 = 0.2 * sin(10.0 * uv.x - u_time * 3.0 + 1.5);
  float line2 = smoothstep(0.015, 0.0, abs(uv.y - wave2));

  // 叠加波
  float combined = wave + wave2;
  float line3 = smoothstep(0.02, 0.0, abs(uv.y - combined));

  // 填充波下方区域
  float fill = smoothstep(0.01, -0.01, uv.y - combined) * 0.15;

  vec3 color = vec3(0.03);
  color += vec3(0.2, 0.5, 1.0) * line;  // 波1 蓝色
  color += vec3(0.2, 0.8, 0.4) * line2; // 波2 绿色
  color += vec3(1.0, 0.4, 0.6) * line3; // 叠加 粉色
  color += vec3(0.3, 0.2, 0.5) * fill;  // 填充区

  // 零线
  color += vec3(0.1) * smoothstep(0.003, 0.0, abs(uv.y));

  gl_FragColor = vec4(color, 1.0);
}
