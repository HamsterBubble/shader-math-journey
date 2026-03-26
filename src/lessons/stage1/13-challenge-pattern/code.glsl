precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  float gridSize = 4.0;

  // TODO: 用 fract/floor 创建网格
  // vec2 cellID = ???
  // vec2 cellUV = ???

  // TODO: 用 cellID 计算动画相位

  // TODO: 画脉动环 (abs(d - radius) < thickness)

  // TODO: 画中心点

  // TODO: 混合颜色

  vec3 color = vec3(0.03);
  gl_FragColor = vec4(color, 1.0);
}
