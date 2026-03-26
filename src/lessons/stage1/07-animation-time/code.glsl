precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // 波浪动画
  float wave = sin(uv.x * 10.0 + u_time * 2.0) * 0.5 + 0.5;

  vec3 colorA = vec3(0.1, 0.1, 0.3);
  vec3 colorB = vec3(0.0, 0.8, 0.6);
  vec3 colorC = vec3(1.0, 0.3, 0.5);

  vec3 color = mix(colorA, colorB, wave);

  float wave2 = sin(uv.y * 8.0 - u_time * 1.5) * 0.5 + 0.5;
  color = mix(color, colorC, wave2 * 0.4);

  gl_FragColor = vec4(color, 1.0);
}
