precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // TODO: 跳动缩放 (sin + 缩放)

  // TODO: 心形公式
  // 提示: a = x*x + y*y - 0.3; heart = a*a*a - x*x*y*y*y;

  vec3 color = vec3(0.03);

  gl_FragColor = vec4(color, 1.0);
}
