precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float sdTriangle(vec2 p, float r) {
  p.y += r * 0.3;
  float k = sqrt(3.0);
  p.x = abs(p.x) - r;
  p.y = p.y + r / k;
  if (p.x + k * p.y > 0.0) p = vec2(p.x - k*p.y, -k*p.x - p.y) / 2.0;
  p.x -= clamp(p.x, -2.0*r, 0.0);
  return -length(p) * sign(p.y);
}

float sdStar(vec2 p, float r, int n) {
  float angle = atan(p.y, p.x);
  float seg = 6.283 / float(n);
  angle = mod(angle + seg * 0.5, seg) - seg * 0.5;
  vec2 q = length(p) * vec2(cos(angle), abs(sin(angle)));
  q -= r * vec2(1.0, 0.4);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 三角形 (左)
  float tri = sdTriangle(uv - vec2(-0.6, 0.0), 0.35);
  // 星形 (中)
  float star = sdStar(uv, 0.35, 5);
  // 圆环 (右)
  float ring = abs(length(uv - vec2(0.6, 0.0)) - 0.25) - 0.04;

  // 取最近的
  float d = min(min(tri, star), ring);
  float shape = smoothstep(0.01, -0.01, d);
  float glow = exp(-abs(d) * 20.0) * 0.4;

  float hue = atan(uv.y, uv.x) / 6.283 + u_time * 0.05;
  vec3 col = vec3(sin(hue*6.283)*0.5+0.5, sin(hue*6.283+2.094)*0.5+0.5, sin(hue*6.283+4.189)*0.5+0.5);

  vec3 color = vec3(0.02);
  color = mix(color, col, shape);
  color += col * glow;

  gl_FragColor = vec4(color, 1.0);
}
