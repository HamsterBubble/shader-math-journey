precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float f(float x) {
  return sin(x * 3.0) * 0.3;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 缩放到更大的 x 范围
  float x = uv.x * 4.0 + u_time;

  // 原函数值
  float y = f(x);

  // 数值导数: (f(x+ε) - f(x)) / ε
  float epsilon = 0.01;
  float dy = (f(x + epsilon) - f(x)) / epsilon;

  // 画出原函数 (红) 和导数 (绿)
  float lineF = smoothstep(0.015, 0.0, abs(uv.y - y));
  float lineDy = smoothstep(0.015, 0.0, abs(uv.y - dy * 0.3));
  float axis = smoothstep(0.004, 0.0, abs(uv.y));

  vec3 color = vec3(0.04);
  color += vec3(0.3) * axis * 0.4;
  color += vec3(1.0, 0.3, 0.3) * lineF;
  color += vec3(0.3, 1.0, 0.4) * lineDy;

  gl_FragColor = vec4(color, 1.0);
}
