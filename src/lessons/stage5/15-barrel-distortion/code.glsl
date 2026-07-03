precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float checker(vec2 uv) {
  vec2 c = floor(uv * 8.0);
  return mod(c.x + c.y, 2.0);
}

vec2 barrel(vec2 uv, float strength) {
  vec2 cc = uv - 0.5;
  float d = dot(cc, cc);
  return uv + cc * d * strength;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  float strength = 0.7 + 0.25 * sin(u_time * 0.8);

  vec2 distortedUV = barrel(uv, strength);
  float pat = mix(checker(uv), checker(distortedUV), step(0.5, gl_FragCoord.x / u_resolution.x));

  vec3 dark = vec3(0.12, 0.14, 0.22);
  vec3 light = vec3(0.85, 0.88, 0.95);
  vec3 color = mix(dark, light, pat);
  float divider = smoothstep(0.004, 0.0, abs(gl_FragCoord.x / u_resolution.x - 0.5));
  color = mix(color, vec3(0.2, 0.55, 1.0), divider);

  gl_FragColor = vec4(color, 1.0);
}
