precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float checker(vec2 uv) {
  vec2 c = floor(uv * 10.0);
  return mod(c.x + c.y, 2.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  vec2 mouseNDC = u_mouse / u_resolution;
  mouseNDC = mouseNDC * 2.0 - 1.0;
  mouseNDC.x *= u_resolution.x / u_resolution.y;
  if (length(u_mouse) < 1.0) {
    mouseNDC = vec2(sin(u_time * 0.7) * 0.45, cos(u_time * 0.5) * 0.25);
  }

  vec2 local = p - mouseNDC;
  float r = length(local);
  float lens = smoothstep(0.42, 0.38, r);

  vec2 uvLocal = local;
  uvLocal.x /= u_resolution.x / u_resolution.y;
  vec2 distorted = uv + uvLocal * r * r * 0.95;

  float basePat = checker(uv);
  float lensPat = checker(distorted);
  vec3 dark = vec3(0.1, 0.12, 0.2);
  vec3 light = vec3(0.86, 0.9, 0.98);
  vec3 base = mix(dark, light, basePat);
  vec3 throughLens = mix(dark, light, lensPat);
  vec3 color = mix(base, throughLens, lens);

  float rim = smoothstep(0.43, 0.39, r) - smoothstep(0.36, 0.32, r);
  color += vec3(0.3, 0.7, 1.0) * rim;
  color *= mix(1.0, 0.82, smoothstep(0.0, 0.42, r) * lens);
  gl_FragColor = vec4(color, 1.0);
}
