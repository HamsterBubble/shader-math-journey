precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 基波
  float wave1 = sin(uv.x * 8.0 + u_time * 2.0);

  // 谐波叠加 → 趋近方波
  float square = sin(uv.x * 8.0 + u_time * 2.0);
  square += sin(uv.x * 24.0 + u_time * 6.0) / 3.0;
  square += sin(uv.x * 40.0 + u_time * 10.0) / 5.0;
  square += sin(uv.x * 56.0 + u_time * 14.0) / 7.0;
  square *= 0.5; // normalize

  // 差频拍 (改 11.0 接近 10.0 看效果)
  float beat = sin(uv.x * 10.0 + u_time) + sin(uv.x * 11.0 + u_time);
  beat *= 0.3;

  // 上半部: 方波近似
  float lineSquare = smoothstep(0.015, 0.0, abs((uv.y - 0.4) - square * 0.3));
  float lineBase = smoothstep(0.008, 0.0, abs((uv.y - 0.4) - wave1 * 0.3));

  // 下半部: 差频拍
  float lineBeat = smoothstep(0.015, 0.0, abs((uv.y + 0.4) - beat));

  // 零线
  float zero1 = smoothstep(0.003, 0.0, abs(uv.y - 0.4));
  float zero2 = smoothstep(0.003, 0.0, abs(uv.y + 0.4));

  vec3 color = vec3(0.03);
  color += vec3(0.15) * (zero1 + zero2);
  color += vec3(0.3, 0.3, 0.5) * lineBase; // 基波 (暗)
  color += vec3(0.3, 0.9, 0.5) * lineSquare; // 方波近似 (亮)
  color += vec3(1.0, 0.5, 0.3) * lineBeat; // 拍频

  gl_FragColor = vec4(color, 1.0);
}
