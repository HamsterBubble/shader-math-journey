precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  vec2 mouseNDC = u_mouse / u_resolution;
  mouseNDC = mouseNDC * 2.0 - 1.0;
  mouseNDC.x *= u_resolution.x / u_resolution.y;

  vec3 color = vec3(0.06, 0.07, 0.12);
  color += vec3(p.x * 0.10 + 0.10, p.y * 0.10 + 0.10, 0.0);

  float axisX = smoothstep(0.012, 0.0, abs(p.y));
  float axisY = smoothstep(0.012, 0.0, abs(p.x));
  color += vec3(0.35, 0.45, 0.7) * max(axisX, axisY);

  float dx = smoothstep(0.018, 0.0, abs(p.x - mouseNDC.x)) * smoothstep(0.18, 0.0, abs(p.y - mouseNDC.y));
  float dy = smoothstep(0.018, 0.0, abs(p.y - mouseNDC.y)) * smoothstep(0.18, 0.0, abs(p.x - mouseNDC.x));
  float ring = smoothstep(0.085, 0.075, abs(length(p - mouseNDC) - 0.08));
  color += vec3(1.0, 0.88, 0.22) * max(max(dx, dy), ring);

  gl_FragColor = vec4(color, 1.0);
}
