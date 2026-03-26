precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 基础形状 SDF
  float circle = length(uv) - 0.5;
  float box = max(abs(uv.x) - 0.35, abs(uv.y) - 0.35);

  // === 运算方式 (试试改这一行) ===
  float d = max(box, -circle); // 差集: 方块挖洞

  // 可视化
  float shape = smoothstep(0.01, -0.01, d);
  float edge = smoothstep(0.02, 0.0, abs(d)); // 边缘线

  // 距离场等高线
  float contour = sin(d * 40.0) * 0.5 + 0.5;
  contour *= smoothstep(0.0, 0.01, abs(d)); // 不在形状内画等高线

  vec3 color = vec3(0.02);
  color += vec3(0.08, 0.04, 0.15) * contour * (1.0 - shape);
  color = mix(color, vec3(0.2, 0.6, 0.9), shape);
  color = mix(color, vec3(1.0), edge * 0.5);

  gl_FragColor = vec4(color, 1.0);
}
