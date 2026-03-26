precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // 原始颜色（彩虹渐变）
  vec3 color = vec3(
    sin(uv.x * 6.283 + 0.0) * 0.5 + 0.5,
    sin(uv.x * 6.283 + 2.094) * 0.5 + 0.5,
    sin(uv.x * 6.283 + 4.189) * 0.5 + 0.5
  );

  // === Swizzle 演示 ===
  // 上半部分: 原始颜色
  // 下半部分: 交换通道
  if (uv.y < 0.5) {
    color = color.rgb; // 试试改成 .brg, .gbr, .bgr
  }

  // 分割线
  float line = smoothstep(0.003, 0.0, abs(uv.y - 0.5));
  color = mix(color, vec3(1.0), line);

  gl_FragColor = vec4(color, 1.0);
}
