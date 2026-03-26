precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // === 可视化不同曲线 ===
  // 把屏幕分三列
  float section = uv.x + 1.0; // [0, 2]

  // 距离到中心
  float d = length(uv);

  // pow — 控制光晕衰减曲线
  float glow1 = pow(max(1.0 - d, 0.0), 2.0);  // 较快衰减
  float glow2 = pow(max(1.0 - d, 0.0), 8.0);  // 锐利亮点

  // exp — 自然衰减 (最常用的光晕方式)
  float glow3 = exp(-d * 3.0);                  // 柔和衰减
  float glow4 = exp(-d * d * 8.0);              // 高斯光点

  // 混合发光层
  vec3 color = vec3(0.02);
  color += vec3(0.2, 0.4, 0.8) * glow3;       // 大范围蓝色雾
  color += vec3(0.8, 0.3, 0.5) * glow1 * 0.5; // 中层粉色
  color += vec3(1.0, 0.9, 0.5) * glow4;       // 高斯白点
  color += vec3(1.0) * glow2 * 0.3;           // 极亮核心

  // Gamma 校正
  color = pow(color, vec3(1.0 / 2.2));

  gl_FragColor = vec4(color, 1.0);
}
