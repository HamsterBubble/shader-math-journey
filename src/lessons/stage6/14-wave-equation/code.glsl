precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float ripple(vec2 pos, vec2 origin, float t) {
  float dist = length(pos - origin);
  float wave = cos(dist * 38.0 - t * 5.0);
  float envelope = exp(-dist * 3.2);
  return wave * envelope;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  vec2 mouse = u_mouse / u_resolution;
  mouse = mouse * 2.0 - 1.0;
  mouse.x *= u_resolution.x / u_resolution.y;

  float h = 0.0;
  h += ripple(p, mouse, u_time) * 0.55;
  h += ripple(p, vec2(0.35, -0.25), u_time + 0.7) * 0.35;
  h += ripple(p, vec2(-0.42, 0.18), u_time * 0.8) * 0.25;

  vec3 deep = vec3(0.02, 0.08, 0.16);
  vec3 crest = vec3(0.35, 0.85, 1.0);
  vec3 color = mix(deep, crest, h * 0.5 + 0.5);
  color += vec3(0.8, 0.95, 1.0) * smoothstep(0.65, 1.0, h) * 0.35;

  gl_FragColor = vec4(color, 1.0);
}
