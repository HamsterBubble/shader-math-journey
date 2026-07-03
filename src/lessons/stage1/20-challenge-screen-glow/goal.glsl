precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

vec3 screenBlend(vec3 a, vec3 b) {
  return 1.0 - (1.0 - a) * (1.0 - b);
}

float glow(vec2 p, vec2 center, float size) {
  vec2 d = p - center;
  return exp(-dot(d, d) * size);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  vec3 color = vec3(0.025, 0.03, 0.07);
  vec2 a = vec2(sin(u_time * 0.8) * 0.45, cos(u_time * 0.6) * 0.22);
  vec3 g1 = vec3(1.0, 0.18, 0.08) * glow(p, a, 4.0);
  vec3 g2 = vec3(0.05, 0.55, 1.0) * glow(p, vec2(-0.38, -0.18), 5.5);
  vec3 g3 = vec3(0.9, 0.18, 1.0) * glow(p, vec2(0.42, 0.25), 6.5);

  color = screenBlend(color, g1);
  color = screenBlend(color, g2);
  color = screenBlend(color, g3);

  float vignette = smoothstep(1.35, 0.25, length(p));
  color *= vignette;
  gl_FragColor = vec4(color, 1.0);
}
