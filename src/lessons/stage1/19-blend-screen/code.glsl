precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

vec3 screenBlend(vec3 a, vec3 b) {
  return 1.0 - (1.0 - a) * (1.0 - b);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  vec3 base = vec3(0.05, 0.06, 0.12);
  vec2 mouse = u_mouse / u_resolution;
  mouse = mouse * 2.0 - 1.0;
  mouse.x *= u_resolution.x / u_resolution.y;
  vec2 glowCenter = mix(vec2(sin(u_time * 0.7) * 0.45, cos(u_time * 0.5) * 0.25), mouse, step(0.001, length(u_mouse)));
  float pulse = 0.85 + 0.15 * sin(u_time * 2.0);
  float glow = exp(-dot(p - glowCenter, p - glowCenter) * 5.0) * pulse;
  vec3 glowColor = vec3(1.0, 0.52, 0.12) * glow;

  vec3 normalMix = mix(base, glowColor, 0.6);
  vec3 screenMix = screenBlend(base, glowColor);
  vec3 color = mix(normalMix, screenMix, step(0.5, uv.x));

  float divider = smoothstep(0.004, 0.0, abs(uv.x - 0.5));
  color += vec3(0.45, 0.55, 0.75) * divider;

  gl_FragColor = vec4(color, 1.0);
}
