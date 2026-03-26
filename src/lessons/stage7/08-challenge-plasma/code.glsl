precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // TODO: 叠加多个 sin 波
  // float v = sin(uv.x * 10.0 + u_time);
  // v += sin(???)

  // TODO: 用 v 做色相映射

  vec3 color = vec3(0.03);

  gl_FragColor = vec4(color, 1.0);
}
