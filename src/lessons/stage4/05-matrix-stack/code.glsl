precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate2d(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, s, -s, c);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 绕非原点旋转: 先移到原点 → 旋转 → 移回去
  vec2 pivot = vec2(0.3, 0.2);
  uv -= pivot;                           // Line A: 平移
  uv = rotate2d(u_time * 0.5) * uv;     // Line B: 旋转
  uv += pivot;                           // 移回

  // 画十字形
  float arm1 = max(abs(uv.x) - 0.08, abs(uv.y) - 0.3);
  float arm2 = max(abs(uv.x) - 0.3, abs(uv.y) - 0.08);
  float cross = min(arm1, arm2);
  float shape = smoothstep(0.01, -0.01, cross);

  // 画轴心标记
  vec2 screenPivot = pivot;
  float pivotDot = smoothstep(0.02, 0.01, length(uv - pivot));

  vec3 color = mix(vec3(0.03), vec3(0.3, 0.7, 1.0), shape);
  color += vec3(1.0, 0.4, 0.3) * pivotDot;

  gl_FragColor = vec4(color, 1.0);
}
