precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;
  // TODO: 定义聚光灯位置和方向
  // TODO: 用 dot(lightDir, pixelDir) 计算聚光锥角
  // TODO: pow 控制聚光的锐利度
  // TODO: 给地面画一个光斑
  vec3 color = vec3(0.02);
  gl_FragColor = vec4(color, 1.0);
}
