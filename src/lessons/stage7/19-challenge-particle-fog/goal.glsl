precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
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

  vec3 color = vec3(0.02, 0.03, 0.06);
  float dist = length(p);
  float fog = fbm(uv * 3.2 + vec2(u_time * 0.04, -u_time * 0.03));
  fog *= smoothstep(0.15, 1.15, dist);
  color = mix(color, vec3(0.28, 0.42, 0.62), fog * 0.8);

  for (int i = 0; i < 18; i++) {
    float fi = float(i);
    vec2 seed = vec2(fi, fi * 1.37);
    float speed = 0.16 + hash(seed + 2.0) * 0.25;
    float life = fract(hash(seed + 3.0) - u_time * speed);
    vec2 center = vec2(hash(seed) * 1.8 - 0.9, hash(seed + 1.0) * 1.2 - 0.6);
    center.y += (1.0 - life) * 0.35;
    float radius = mix(0.018, 0.075, life);
    float mask = smoothstep(radius, radius - 0.014, length(p - center));
    float localFog = fbm(center * 3.0 + u_time * 0.08);
    vec3 hot = mix(vec3(0.35, 0.1, 0.55), vec3(1.0, 0.78, 0.35), life);
    color += hot * mask * life * (0.6 + localFog);
  }

  color *= smoothstep(1.45, 0.2, dist);
  gl_FragColor = vec4(color, 1.0);
}
