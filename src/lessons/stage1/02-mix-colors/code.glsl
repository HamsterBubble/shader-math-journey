precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  vec3 colorA = vec3(1.0, 0.2, 0.4);  // 红粉
  vec3 colorB = vec3(0.2, 0.5, 1.0);  // 蓝色

  // mix(): 用 uv.x 在两色之间插值
  vec3 color = mix(colorA, colorB, uv.x);

  gl_FragColor = vec4(color, 1.0);
}
