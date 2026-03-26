precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // TODO: 定义 3 个运动的球心
  // 提示: vec2 p1 = vec2(cos(t), sin(t)) * 0.5;

  // TODO: 计算能量场
  // 提示: float e = radius / length(uv - p1) + ...

  // TODO: 用阈值提取形状
  // 提示: smoothstep(0.95, 1.05, e)

  vec3 color = vec3(0.03);

  gl_FragColor = vec4(color, 1.0);
}
