precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  float grid = 8.0;
  float checker = mod(floor(uv.x * grid) + floor(uv.y * grid), 2.0);

  vec3 dark = vec3(0.12, 0.1, 0.15);
  vec3 light = vec3(0.85, 0.82, 0.75);
  vec3 color = mix(dark, light, checker);

  // 微妙的光照渐变
  color *= 0.85 + 0.15 * (1.0 - length(uv - 0.5));

  // 柔和的边框
  vec2 cellUV = fract(uv * grid);
  float border = smoothstep(0.02, 0.05, min(cellUV.x, cellUV.y));
  border *= smoothstep(0.02, 0.05, min(1.0-cellUV.x, 1.0-cellUV.y));
  color *= 0.9 + 0.1 * border;

  gl_FragColor = vec4(color, 1.0);
}
