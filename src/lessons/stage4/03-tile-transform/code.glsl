precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate2d(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, s, -s, c);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  float grid = 5.0;
  vec2 cellID = floor(uv * grid);
  vec2 cellUV = fract(uv * grid) - 0.5; // 居中到 [-0.5, 0.5]

  // 每个格子不同旋转角度
  float angle = u_time + (cellID.x + cellID.y) * 0.5;
  cellUV = rotate2d(angle) * cellUV;

  // 画方块
  vec2 d = abs(cellUV) - vec2(0.2);
  float box = length(max(d, 0.0));
  float shape = smoothstep(0.02, 0.0, box);

  // 颜色随格子变化
  float hue = (cellID.x * 3.0 + cellID.y * 7.0) * 0.1;
  vec3 col = vec3(
    sin(hue) * 0.5 + 0.5,
    sin(hue + 2.0) * 0.5 + 0.5,
    sin(hue + 4.0) * 0.5 + 0.5
  );

  vec3 color = mix(vec3(0.02), col, shape);
  gl_FragColor = vec4(color, 1.0);
}
