precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  // 步骤1: 归一化像素坐标到 [0, 1]
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // 步骤2: 用坐标值作为颜色
  // uv.x → 红色: 左=0(黑), 右=1(红)
  vec3 color = vec3(uv.x, 0.0, 0.0);

  // 步骤3: 输出
  gl_FragColor = vec4(color, 1.0);
}
