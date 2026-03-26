precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float scene(vec2 p) {
  // TODO: 组合 2-3 个形状
  return length(p) - 0.5;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float d = scene(uv);

  // TODO: 用数值微分计算法线
  // float e = 0.001;
  // vec2 n = normalize(vec2(
  //   scene(uv + vec2(e,0)) - scene(uv - vec2(e,0)),
  //   scene(uv + vec2(0,e)) - scene(uv - vec2(0,e))
  // ));

  // TODO: 可视化法线方向

  vec3 color = vec3(0.03);
  gl_FragColor = vec4(color, 1.0);
}
