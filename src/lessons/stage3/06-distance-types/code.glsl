precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  vec2 p = abs(uv);

  // Minkowski 距离 (改 n 值!)
  float n = 2.0 + sin(u_time) * 1.5; // 在 0.5~3.5 间变化
  float d = pow(pow(p.x, n) + pow(p.y, n), 1.0 / n);

  // 等高线
  float rings = sin(d * 30.0) * 0.5 + 0.5;
  float edge = smoothstep(0.01, -0.01, d - 0.5);

  // 颜色映射
  float hue = d * 2.0;
  vec3 col = vec3(
    sin(hue) * 0.5 + 0.5,
    sin(hue + 2.094) * 0.5 + 0.5,
    sin(hue + 4.189) * 0.5 + 0.5
  );

  vec3 color = col * rings * smoothstep(1.5, 0.0, d) * 0.5;
  color = mix(color, col * 0.8, edge);

  gl_FragColor = vec4(color, 1.0);
}
