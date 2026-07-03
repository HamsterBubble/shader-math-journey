precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float ripple(vec2 p, vec2 origin, float phase) {
  float d = length(p - origin);
  return cos(d * 34.0 - phase) * exp(-d * 3.4);
}

void main() {
  vec2 p = gl_FragCoord.xy / u_resolution.xy * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  float h = 0.0;
  vec3 particles = vec3(0.0);

  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float angle = u_time * (0.35 + fi * 0.08) + fi * 6.28318 / 5.0;
    vec2 origin = vec2(cos(angle), sin(angle * 1.3)) * vec2(0.55, 0.32);
    h += ripple(p, origin, u_time * 4.5 + fi);
    float dotMask = smoothstep(0.045, 0.025, length(p - origin));
    particles += vec3(1.0, 0.65, 0.25) * dotMask;
  }

  h *= 0.22;
  vec3 deep = vec3(0.02, 0.07, 0.14);
  vec3 crest = vec3(0.25, 0.8, 1.0);
  vec3 color = mix(deep, crest, h + 0.5);
  color += vec3(0.75, 0.95, 1.0) * smoothstep(0.35, 0.7, h);
  color += particles;

  gl_FragColor = vec4(color, 1.0);
}
