precision mediump float;
#extension GL_OES_standard_derivatives : enable
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 距离场
  float d = length(uv) - 0.5;

  // === 抗锯齿 (AA) 对比 ===
  // 无 AA (锯齿！)
  float hardEdge = step(0.0, -d);

  // 有 AA (用 fwidth)
  float fw = fwidth(d);
  float smoothEdge = smoothstep(fw, -fw, d);

  // 选择显示哪个 (左半=无AA, 右半=有AA)
  float shape = mix(hardEdge, smoothEdge, step(0.0, uv.x));

  // 等宽等高线 (用 fwidth 实现)
  float lines = abs(fract(d * 10.0 + 0.5) - 0.5);
  float lineWidth = fwidth(d * 10.0);
  float contour = smoothstep(lineWidth, 0.0, lines);

  // 分界线
  float divider = smoothstep(0.005, 0.0, abs(uv.x));

  vec3 color = vec3(0.03);
  color = mix(color, vec3(0.2, 0.6, 0.9), shape);
  color += vec3(0.4, 0.8, 0.4) * contour * 0.3 * (1.0 - shape);
  color += vec3(0.5) * divider;

  gl_FragColor = vec4(color, 1.0);
}
