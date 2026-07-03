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
  const float N = 12.0;

  for (float i = 0.0; i < N; i += 1.0) {
    vec2 seed = vec2(i, i * 1.7);
    vec2 center = vec2(
      hash(seed) * 1.6 - 0.8,
      hash(seed + 1.0) * 1.2 - 0.6
    );
    center.y += (1.0 - fract(u_time * 0.08 + hash(seed + 4.0))) * 0.35;

    float speed = 0.3 + hash(seed + 2.0) * 0.45;
    float life = fract(hash(seed + 3.0) - u_time * speed);
    float radius = mix(0.018, 0.07, life);
    float d = length(p - center);
    float circle = smoothstep(radius, radius - 0.012, d);
    vec3 particleColor = mix(vec3(0.8, 0.08, 0.02), vec3(1.0, 0.88, 0.35), life);
    color += particleColor * circle * life;
  }

  gl_FragColor = vec4(color, 1.0);
}
