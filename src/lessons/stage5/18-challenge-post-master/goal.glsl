precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

vec3 screenBlend(vec3 a, vec3 b) {
  return 1.0 - (1.0 - a) * (1.0 - b);
}

vec2 barrelDistortion(vec2 uv, float amt) {
  vec2 cc = uv - 0.5;
  float dist = dot(cc, cc);
  return uv + cc * dist * amt;
}

float gridPattern(vec2 uv) {
  vec2 g = abs(fract(uv * 10.0) - 0.5);
  return smoothstep(0.46, 0.5, max(g.x, g.y));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  float amt = -1.5;
  vec2 distortedUv = barrelDistortion(uv, amt);

  vec3 base = vec3(0.05, 0.06, 0.12) + vec3(0.5) * gridPattern(distortedUv);

  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  vec2 mouse = u_mouse / u_resolution;
  mouse = mouse * 2.0 - 1.0;
  mouse.x *= u_resolution.x / u_resolution.y;
  vec2 glowCenter = mix(vec2(sin(u_time * 0.7) * 0.45, cos(u_time * 0.5) * 0.25), mouse, step(0.001, length(u_mouse)));
  float pulse = 0.85 + 0.15 * sin(u_time * 2.0);
  float glow = exp(-dot(p - glowCenter, p - glowCenter) * 5.0) * pulse;
  vec3 glowColor = vec3(1.0, 0.52, 0.12) * glow;

  vec3 color = screenBlend(base, glowColor);

  gl_FragColor = vec4(color, 1.0);
}
