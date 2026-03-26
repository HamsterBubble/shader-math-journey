precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 投影轴 (旋转中)
  float angle = u_time * 0.5;
  vec2 axis = vec2(cos(angle), sin(angle));

  // 投影: A 到 axis 的投影标量
  float projScalar = dot(uv, axis);

  // 投影向量 和 拒绝向量
  vec2 projVec = projScalar * axis;
  vec2 rejVec = uv - projVec;
  float rejLen = length(rejVec);

  // 可视化投影轴
  float axisLine = smoothstep(0.008, 0.0, abs(dot(uv, vec2(-axis.y, axis.x))));

  // 可视化投影分量 (颜色编码)
  float projViz = projScalar * 0.5 + 0.5;

  // 可视化拒绝距离 (等高线)
  float rejLines = smoothstep(0.008, 0.0, abs(fract(rejLen * 8.0) - 0.5));

  vec3 color = vec3(0.03);
  color += vec3(0.2, 0.5, 1.0) * projViz * 0.6;
  color += vec3(1.0, 0.3, 0.5) * (1.0 - projViz) * 0.3;
  color += vec3(0.4) * axisLine;
  color += vec3(0.15, 0.3, 0.15) * rejLines * 0.5;

  gl_FragColor = vec4(color, 1.0);
}
