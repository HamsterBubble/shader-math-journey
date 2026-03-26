precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// 缓动函数
float easeInQuad(float t) { return t * t; }
float easeOutQuad(float t) { return t * (2.0 - t); }
float easeInOutQuad(float t) {
  return t < 0.5 ? 2.0 * t * t : -1.0 + (4.0 - 2.0 * t) * t;
}
float easeOutBounce(float t) {
  if (t < 1.0/2.75) return 7.5625*t*t;
  else if (t < 2.0/2.75) { t -= 1.5/2.75; return 7.5625*t*t + 0.75; }
  else if (t < 2.5/2.75) { t -= 2.25/2.75; return 7.5625*t*t + 0.9375; }
  else { t -= 2.625/2.75; return 7.5625*t*t + 0.984375; }
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  float t = fract(u_time * 0.3);

  // 4 条曲线并排显示
  float yLinear = t;
  float yEaseIn = easeInQuad(t);
  float yEaseOut = easeOutQuad(t);
  float yBounce = easeOutBounce(t);

  // 画4个运动的圆点
  float section = 0.25;
  float d1 = length(uv - vec2(0.2, yLinear * 0.8 + 0.1));
  float d2 = length(uv - vec2(0.45, yEaseIn * 0.8 + 0.1));
  float d3 = length(uv - vec2(0.7, yEaseOut * 0.8 + 0.1));
  float d4 = length(uv - vec2(0.95, yBounce * 0.8 + 0.1));

  vec3 color = vec3(0.05);
  color += vec3(0.3, 0.6, 1.0) * smoothstep(0.04, 0.02, d1);
  color += vec3(1.0, 0.4, 0.3) * smoothstep(0.04, 0.02, d2);
  color += vec3(0.3, 1.0, 0.5) * smoothstep(0.04, 0.02, d3);
  color += vec3(1.0, 0.8, 0.2) * smoothstep(0.04, 0.02, d4);

  gl_FragColor = vec4(color, 1.0);
}
