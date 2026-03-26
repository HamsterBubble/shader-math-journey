precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i+vec2(1,0));
  float c = hash(i+vec2(0,1)), d = hash(i+vec2(1,1));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0; a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.15;

  // === 域扭曲 ===
  // 第一层
  vec2 q = vec2(
    fbm(uv * 3.0 + vec2(0.0, 0.0) + t),
    fbm(uv * 3.0 + vec2(5.2, 1.3) + t)
  );

  // 第二层: 用第一层扭曲
  vec2 r = vec2(
    fbm(uv * 3.0 + 4.0 * q + vec2(1.7, 9.2) + t * 0.5),
    fbm(uv * 3.0 + 4.0 * q + vec2(8.3, 2.8) + t * 0.3)
  );

  // 最终值
  float f = fbm(uv * 3.0 + 4.0 * r);

  // 有机颜色映射
  vec3 color = mix(vec3(0.1, 0.15, 0.3), vec3(0.2, 0.4, 0.6), f);
  color = mix(color, vec3(0.6, 0.3, 0.2), dot(q, q) * 0.8);
  color = mix(color, vec3(0.9, 0.7, 0.4), r.x * r.y * 1.5);
  color *= f * 1.5 + 0.3;

  gl_FragColor = vec4(color, 1.0);
}
