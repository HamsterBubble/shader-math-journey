precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // step(edge, x): x < edge ? 0.0 : 1.0
  float s = step(0.5, uv.x);

  vec3 color = vec3(s * 0.3, s * 0.6, s * 1.0);

  gl_FragColor = vec4(color, 1.0);
}
