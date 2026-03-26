precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// IQ Cosine 调色板 — Shader 的经典配色方法
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.283 * (c * t + d));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float d = length(uv);
  float angle = atan(uv.y, uv.x);

  // t 值：混合距离和角度
  float t = d * 2.0 + angle / 6.283 + u_time * 0.2;

  // IQ 调色板参数 (试着改这些值!)
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 dd = vec3(0.00, 0.33, 0.67);

  vec3 color = palette(t, a, b, c, dd);

  // 衰减到中心
  color *= smoothstep(1.5, 0.0, d);

  gl_FragColor = vec4(color, 1.0);
}
