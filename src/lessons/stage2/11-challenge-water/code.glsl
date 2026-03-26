precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // TODO: 计算到中心的距离

  // TODO: 水波 = sin(distance * freq - u_time * speed) * 衰减

  // TODO: 配色 (深蓝 → 浅蓝 + 波纹高光)

  vec3 color = vec3(0.0, 0.1, 0.3);

  gl_FragColor = vec4(color, 1.0);
}
