precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    v += noise(p) * amp;
    p *= 2.0;
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  float fog = fbm(uv * 3.0 + vec2(u_time * 0.05, u_time * 0.02));
  fog += 0.35 * fbm(uv * 7.0 - vec2(u_time * 0.03, u_time * 0.04));

  float dist = length(p);
  float falloff = smoothstep(0.2, 1.25, dist);
  fog *= falloff;

  vec3 bg = vec3(0.04, 0.06, 0.1);
  vec3 fogColor = vec3(0.5, 0.65, 0.8);
  vec3 color = mix(bg, fogColor, fog * 0.85);

  gl_FragColor = vec4(color, 1.0);
}
