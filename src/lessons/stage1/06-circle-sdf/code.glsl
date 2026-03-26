precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 圆 SDF: length(p) - radius
  float radius = 0.4;
  float d = length(uv) - radius;

  float circle = smoothstep(0.01, -0.01, d);

  vec3 bg = vec3(0.05, 0.06, 0.1);
  vec3 fg = vec3(0.2, 0.6, 1.0);
  vec3 color = mix(bg, fg, circle);

  // 辉光
  color += fg * 0.15 * exp(-abs(d) * 15.0);

  gl_FragColor = vec4(color, 1.0);
}
