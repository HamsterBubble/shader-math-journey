precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 波浪参数
  float frequency = 8.0;
  float amplitude = 0.2;
  float speed = 2.0;

  // sin 波: y = A * sin(F * x + phase)
  float wave = amplitude * sin(frequency * uv.x + u_time * speed);

  // 用 smoothstep 画出波浪线
  float thickness = 0.02;
  float line = smoothstep(thickness, 0.0, abs(uv.y - wave));

  // x 轴参考线
  float axis = smoothstep(0.005, 0.0, abs(uv.y));

  vec3 color = vec3(0.05, 0.05, 0.1);
  color += vec3(0.2, 0.6, 1.0) * line;
  color += vec3(0.3) * axis * 0.3;

  gl_FragColor = vec4(color, 1.0);
}
