precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// 值域映射函数
float remap(float value, float inMin, float inMax, float outMin, float outMax) {
  float t = clamp((value - inMin) / (inMax - inMin), 0.0, 1.0);
  return mix(outMin, outMax, t);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  // 模拟"温度"值 (波动的渐变)
  float temp = sin(uv.x * 5.0 - u_time) * cos(uv.y * 3.0 + u_time * 0.7);
  // temp 范围是 [-1, 1]

  // 映射到 [0, 1] — 用于着色
  float t = remap(temp, -1.0, 1.0, 0.0, 1.0);

  // 温度色阶: 蓝(冷) → 绿 → 黄 → 红(热)
  vec3 cold = vec3(0.1, 0.2, 0.8);
  vec3 cool = vec3(0.1, 0.7, 0.3);
  vec3 warm = vec3(0.9, 0.8, 0.1);
  vec3 hot  = vec3(0.9, 0.1, 0.1);

  vec3 color;
  if (t < 0.33) color = mix(cold, cool, t / 0.33);
  else if (t < 0.66) color = mix(cool, warm, (t - 0.33) / 0.33);
  else color = mix(warm, hot, (t - 0.66) / 0.34);

  // clamp 的效果 — 去掉这行看原始值
  t = clamp(t, 0.2, 0.8);

  gl_FragColor = vec4(color, 1.0);
}
