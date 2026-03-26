precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  // fract() 重复 N 次 → 改这个数字！
  uv = fract(uv * 3.0);

  // 到格子中心距离
  float d = length(uv - 0.5);
  float circle = smoothstep(0.3, 0.28, d);

  vec3 bg = vec3(0.05, 0.05, 0.1);
  vec3 fg = vec3(0.3, 0.7, 1.0);
  vec3 color = mix(bg, fg, circle);

  gl_FragColor = vec4(color, 1.0);
}
