precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// 2D 叉积: a.x*b.y - a.y*b.x
float cross2d(vec2 a, vec2 b) {
  return a.x * b.y - a.y * b.x;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 两个向量
  vec2 a = vec2(cos(u_time), sin(u_time)) * 0.6;
  vec2 b = vec2(cos(u_time * 0.7 + 1.5), sin(u_time * 0.7 + 1.5)) * 0.5;

  // 叉积的符号表示"左右关系"
  float cp = cross2d(a, b);

  // 背景颜色由叉积符号决定
  vec3 bgColor = cp > 0.0
    ? vec3(0.1, 0.15, 0.3)   // b 在 a 的左边 = 蓝
    : vec3(0.3, 0.1, 0.15);  // b 在 a 的右边 = 红

  // 画向量箭头
  float lineA = smoothstep(0.015, 0.0, abs(cross2d(normalize(a), uv) / length(a)) - 0.0)
    * step(0.0, dot(normalize(a), uv)) * step(length(uv), length(a));
  float lineB = smoothstep(0.015, 0.0, abs(cross2d(normalize(b), uv) / length(b)) - 0.0)
    * step(0.0, dot(normalize(b), uv)) * step(length(uv), length(b));

  // 简化：用距离线段画
  float dA = length(uv - clamp(dot(uv, normalize(a)), 0.0, length(a)) * normalize(a));
  float dB = length(uv - clamp(dot(uv, normalize(b)), 0.0, length(b)) * normalize(b));

  vec3 color = bgColor;
  color += vec3(0.3, 0.7, 1.0) * smoothstep(0.02, 0.005, dA);
  color += vec3(1.0, 0.5, 0.3) * smoothstep(0.02, 0.005, dB);

  // 原点
  color += vec3(1.0) * smoothstep(0.04, 0.02, length(uv));

  gl_FragColor = vec4(color, 1.0);
}
