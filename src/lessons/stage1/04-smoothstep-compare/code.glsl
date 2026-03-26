precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // 上半: smoothstep (平滑)
  float smooth = smoothstep(0.4, 0.6, uv.x);
  // 下半: step (硬边) 做对比
  float hard = step(0.5, uv.x);

  float result = mix(hard, smooth, step(0.5, uv.y));

  // 中间分界线
  float line = smoothstep(0.498, 0.5, uv.y)
             - smoothstep(0.5, 0.502, uv.y);

  vec3 color = vec3(result * 0.3, result * 0.7, result);
  color += vec3(1.0, 1.0, 0.0) * line * 0.5;

  gl_FragColor = vec4(color, 1.0);
}
