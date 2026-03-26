precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float sdBox(vec2 p, vec2 s) {
  vec2 d = abs(p) - s;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

// 平滑并集
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float move = sin(u_time) * 0.3;

  float circle = sdCircle(uv - vec2(move, 0.0), 0.35);
  float box = sdBox(uv + vec2(move, 0.0), vec2(0.25));

  // 试试: min (并集), max (交集), max(circle, -box) (差集)
  float d = smin(circle, box, 0.15); // 平滑并集

  float shape = smoothstep(0.01, -0.01, d);

  vec3 color = mix(vec3(0.03), vec3(0.9, 0.3, 0.4), shape);
  color += vec3(0.9, 0.3, 0.4) * 0.08 * exp(-abs(d) * 12.0);

  gl_FragColor = vec4(color, 1.0);
}
