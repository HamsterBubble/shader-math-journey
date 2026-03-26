precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 用 step 做条件选择（无分支）
  float mask = step(0.0, uv.x);
  vec3 colorA = vec3(0.2, 0.5, 1.0);  // 左侧蓝
  vec3 colorB = vec3(1.0, 0.4, 0.2);  // 右侧橙

  // mix + step = 无分支三元运算
  vec3 color = mix(colorA, colorB, mask);

  // 圆形区域选择
  float d = length(uv) - 0.4;
  float circleMask = step(0.0, -d);

  vec3 circleColor = vec3(0.1, 0.9, 0.5);
  color = mix(color, circleColor, circleMask);

  // 动画选择
  float pulse = step(0.0, sin(u_time * 3.0));
  color *= 0.7 + 0.3 * pulse;

  gl_FragColor = vec4(color, 1.0);
}
