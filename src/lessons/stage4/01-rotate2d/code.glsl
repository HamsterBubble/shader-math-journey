precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// 2D 旋转矩阵
mat2 rotate2d(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, s, -s, c);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 应用旋转！矩阵 * 向量
  uv = rotate2d(u_time * 0.5) * uv;

  // 画一个方块（矩形 SDF）
  vec2 d = abs(uv) - vec2(0.3);
  float box = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  float shape = smoothstep(0.01, -0.01, box);

  vec3 color = mix(vec3(0.03), vec3(0.3, 0.7, 1.0), shape);
  color += vec3(0.2, 0.5, 1.0) * 0.1 * exp(-abs(box) * 12.0);

  gl_FragColor = vec4(color, 1.0);
}
