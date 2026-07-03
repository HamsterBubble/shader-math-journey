precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float checker(vec2 uv) {
  vec2 c = floor(uv * 10.0);
  return mod(c.x + c.y, 2.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  // TODO: 将 u_mouse 转为 aspect-correct NDC
  vec2 mouseNDC = vec2(0.0);

  // TODO: 以 mouseNDC 为中心构造桶形畸变 UV
  vec2 sampleUV = uv;

  // TODO: 镜头圆内采样 sampleUV，圆外采样 uv
  float pat = checker(uv);
  vec3 color = mix(vec3(0.12, 0.14, 0.22), vec3(0.85, 0.88, 0.95), pat);

  gl_FragColor = vec4(color, 1.0);
}
