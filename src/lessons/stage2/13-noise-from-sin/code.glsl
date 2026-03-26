precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// 用叠加 sin 波构造伪噪声
float sinNoise(vec2 p) {
  float n = 0.0;
  n += sin(p.x * 1.0 + p.y * 1.7 + u_time) * 0.5;
  n += sin(p.x * 2.3 - p.y * 1.3 + u_time * 0.7) * 0.25;
  n += sin(p.x * 4.1 + p.y * 3.7 + u_time * 1.3) * 0.125;
  n += sin(p.x * 8.3 - p.y * 7.1 + u_time * 0.5) * 0.0625;
  return n * 0.5 + 0.5; // 映射到 [0, 1]
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  float n = sinNoise(uv * 6.0);

  // 用噪声驱动颜色
  vec3 color = mix(
    vec3(0.1, 0.2, 0.4),
    vec3(0.8, 0.6, 0.2),
    n
  );

  gl_FragColor = vec4(color, 1.0);
}
