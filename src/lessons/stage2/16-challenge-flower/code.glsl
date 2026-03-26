precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // TODO: 转换到极坐标 (r, theta)
  // float r = length(uv);
  // float theta = atan(uv.y, uv.x);

  // TODO: 用 sin(theta * N) 做花瓣形状
  // 提示: float petal = cos(theta * N) 其中 N=花瓣数

  // TODO: 比较 r 与花瓣半径 → SDF

  // TODO: 上色 + 动画

  vec3 color = vec3(0.05);
  gl_FragColor = vec4(color, 1.0);
}
