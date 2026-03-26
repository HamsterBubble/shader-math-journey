precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // sign(x) 返回: -1.0, 0.0, 或 1.0
  float s = sign(uv.x);

  // 用 sign 做左右分色
  vec3 leftColor = vec3(0.2, 0.5, 1.0);
  vec3 rightColor = vec3(1.0, 0.3, 0.5);

  // sign 返回 -1/+1, 映射到 0/1
  float t = s * 0.5 + 0.5;
  vec3 color = mix(leftColor, rightColor, t);

  // 中心线
  float centerLine = smoothstep(0.02, 0.0, abs(uv.x));
  color = mix(color, vec3(1.0), centerLine);

  // 用 sign 翻转 y 方向的波
  float wave = sin(uv.y * 10.0 + u_time * 2.0) * 0.1;
  float waveLine = smoothstep(0.01, 0.0, abs(uv.x - wave * sign(uv.y)));
  color += vec3(0.8) * waveLine;

  gl_FragColor = vec4(color, 1.0);
}
