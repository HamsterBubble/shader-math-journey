precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // TODO: 创建天空渐变（从底部暖色到顶部冷色）
  // 提示: mix(暖色, 冷色, uv.y)

  // TODO: 画太阳（圆形 SDF + 暖色）
  // 提示: 太阳位置可以随 u_time 缓慢升起

  // TODO: 太阳光晕
  // 提示: exp(-distance * k)

  // TODO: 地平线
  // 提示: step 或 smoothstep 在某个 y 值

  vec3 color = vec3(uv.y * 0.3, 0.1, 0.2);
  gl_FragColor = vec4(color, 1.0);
}
