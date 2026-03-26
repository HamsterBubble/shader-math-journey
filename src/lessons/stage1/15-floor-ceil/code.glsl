precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  float grid = 6.0;
  vec2 scaled = uv * grid;

  // floor: 向下取整 → 格子编号
  vec2 cellID = floor(scaled);

  // fract: 格子内部坐标 [0,1)
  vec2 cellUV = fract(scaled);

  // ceil vs floor 差异可视化
  float floorVal = floor(scaled.x) / grid;
  float ceilVal = ceil(scaled.x) / grid;

  // 上半部分显示 floor 效果（色阶），下半部分显示 ceil
  vec3 color;
  if (uv.y > 0.5) {
    color = vec3(floorVal, 0.3, 0.5);
  } else {
    color = vec3(ceilVal, 0.5, 0.3);
  }

  // 网格线
  vec2 gridLine = smoothstep(vec2(0.02), vec2(0.0), cellUV);
  color = mix(color, vec3(0.8), max(gridLine.x, gridLine.y) * 0.4);

  gl_FragColor = vec4(color, 1.0);
}
