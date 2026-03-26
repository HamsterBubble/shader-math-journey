precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float r = length(uv);
  float angle = atan(uv.y, uv.x);

  // 放射条纹
  float segments = 12.0;
  float stripe = fract(angle / 6.283 * segments + u_time * 0.2);
  stripe = step(0.5, stripe);

  // 中心淡出
  float vignette = smoothstep(0.0, 0.3, r);
  stripe *= vignette;

  // 配色
  vec3 colA = vec3(0.1, 0.05, 0.2);
  vec3 colB = vec3(0.9, 0.4, 0.1);
  vec3 color = mix(colA, colB, stripe);

  // 中心高光
  color += vec3(1.0, 0.8, 0.4) * 0.15 * exp(-r * 8.0);

  gl_FragColor = vec4(color, 1.0);
}
