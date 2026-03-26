precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 两个圆心
  vec2 centerA = vec2(-0.3, 0.0);
  vec2 centerB = vec2(0.3, 0.0);

  // uv - center = 从圆心到像素的向量
  float dA = length(uv - centerA);
  float dB = length(uv - centerB);

  float circleA = smoothstep(0.32, 0.3, dA);
  float circleB = smoothstep(0.32, 0.3, dB);

  vec3 color = vec3(0.03);
  color += vec3(1.0, 0.2, 0.3) * circleA * 0.7;
  color += vec3(0.2, 0.5, 1.0) * circleB * 0.7;

  gl_FragColor = vec4(color, 1.0);
}
