precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  vec3 color = vec3(0.02, 0.02, 0.04);
  const float N = 18.0;
  vec2 origin = vec2(0.0, -0.55);

  for (float i = 0.0; i < N; i += 1.0) {
    vec2 seed = vec2(i, i * 1.7);
    float rnd = hash(seed);
    float speed = 0.4 + hash(seed + 2.0) * 0.8;
    float angle = (hash(seed + 3.0) - 0.5) * 1.1;
    vec2 dir = normalize(vec2(sin(angle), 1.0 + hash(seed + 5.0) * 0.3));

    float period = 1.0 + hash(seed + 4.0) * 0.6;
    float life = fract(u_time / period + rnd);

    // TODO: origin + dir * (1.0 + speed) * life
    vec2 center = origin;

    float startFade = smoothstep(0.0, 0.1, life);
    float endFade = smoothstep(1.0, 0.8, life);
    float alpha = min(startFade, endFade);

    float size = mix(0.02, 0.05, rnd) * (0.6 + 0.4 * endFade);
    float d = length(p - center);
    float circle = smoothstep(size, size * 0.3, d);

    vec3 gold = vec3(1.0, 0.353, 0.0);
    vec3 amber = vec3(1.0, 0.714, 0.024);
    vec3 particleColor = mix(gold, amber, rnd);

    color += particleColor * circle * alpha * (0.4 + rnd * 0.6);
  }

  gl_FragColor = vec4(color, 1.0);
}
