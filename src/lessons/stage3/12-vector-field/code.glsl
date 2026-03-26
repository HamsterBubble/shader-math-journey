precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 向量场: 旋转场
  vec2 field = vec2(-uv.y, uv.x);

  // 颜色编码：方向→色相，大小→亮度
  float angle = atan(field.y, field.x);
  float mag = length(field);

  // 简单的角度→色相映射
  vec3 color;
  float hue = angle / 6.2832 + 0.5;
  color.r = abs(hue * 6.0 - 3.0) - 1.0;
  color.g = 2.0 - abs(hue * 6.0 - 2.0);
  color.b = 2.0 - abs(hue * 6.0 - 4.0);
  color = clamp(color, 0.0, 1.0);

  color *= 0.3 + 0.7 * smoothstep(0.0, 1.0, mag);

  // 用网格画箭头
  vec2 gridUV = fract(uv * 4.0 + 0.5) - 0.5;
  vec2 cellCenter = floor(uv * 4.0 + 0.5) / 4.0;
  vec2 cellField = vec2(-cellCenter.y, cellCenter.x); // 这个格子的向量值
  vec2 dir = normalize(cellField);

  // 箭头线
  float arrow = smoothstep(0.03, 0.01, abs(dot(gridUV, vec2(-dir.y, dir.x))));
  arrow *= step(0.0, dot(gridUV, dir)) * step(length(gridUV), 0.12);

  color += vec3(1.0) * arrow * 0.6;

  gl_FragColor = vec4(color, 1.0);
}
