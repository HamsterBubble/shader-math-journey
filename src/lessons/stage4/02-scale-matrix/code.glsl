precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate2d(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, s, -s, c);
}

mat2 scale2d(float sx, float sy) {
  return mat2(sx, 0.0, 0.0, sy);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 组合变换 (从右到左: 先缩放，再旋转)
  float pulse = 1.0 + 0.3 * sin(u_time * 2.0);
  uv = rotate2d(u_time * 0.3) * scale2d(pulse, 1.0) * uv;

  // 十字形 SDF
  float arm1 = max(abs(uv.x) - 0.08, abs(uv.y) - 0.4);
  float arm2 = max(abs(uv.x) - 0.4, abs(uv.y) - 0.08);
  float cross = min(arm1, arm2);
  float shape = smoothstep(0.01, -0.01, cross);

  vec3 color = mix(vec3(0.03), vec3(1.0, 0.4, 0.3), shape);

  gl_FragColor = vec4(color, 1.0);
}
