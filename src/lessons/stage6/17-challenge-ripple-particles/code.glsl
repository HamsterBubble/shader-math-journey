precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float ripple(vec2 p, vec2 origin, float phase) {
  // TODO: 返回随距离衰减的余弦波
  return 0.0;
}

void main() {
  vec2 p = gl_FragCoord.xy / u_resolution.xy * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  float h = 0.0;
  vec3 color = vec3(0.02, 0.07, 0.13);

  // TODO: 循环生成多个粒子，叠加 ripple，并绘制粒子圆点

  gl_FragColor = vec4(color, 1.0);
}
