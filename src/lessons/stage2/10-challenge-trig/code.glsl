precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float r = length(uv);
  float angle = atan(uv.y, uv.x);

  // TODO: 画螺旋
  // 提示: fract(angle / 6.283 * arms + r * factor)

  vec3 color = vec3(0.03);

  gl_FragColor = vec4(color, 1.0);
}
