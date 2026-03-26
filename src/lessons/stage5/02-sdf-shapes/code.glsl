precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// 圆角矩形 SDF
float sdRoundBox(vec2 p, vec2 size, float r) {
  vec2 d = abs(p) - size + r;
  return length(max(d, 0.0)) - r + min(max(d.x, d.y), 0.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 圆角矩形
  float d = sdRoundBox(uv, vec2(0.5, 0.3), 0.08);
  float shape = smoothstep(0.01, -0.01, d);

  // 距离场可视化（等高线）
  float contour = abs(fract(d * 15.0 + 0.5) - 0.5) / fwidth(d * 15.0);
  float lines = 1.0 - min(contour, 1.0);

  vec3 color = vec3(0.03);
  color = mix(color, vec3(0.2, 0.7, 0.5), shape);
  color += vec3(0.1, 0.3, 0.5) * lines * 0.4 * (1.0 - shape);

  gl_FragColor = vec4(color, 1.0);
}
