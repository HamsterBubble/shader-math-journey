precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // TODO: 画几个形状的 SDF (圆环、波浪线)
  // 提示: abs(length(uv) - r) 是环的 SDF

  // TODO: 辉光 = exp(-distance * intensity)

  // TODO: 叠加不同颜色

  vec3 color = vec3(0.01, 0.01, 0.02);

  gl_FragColor = vec4(color, 1.0);
}
