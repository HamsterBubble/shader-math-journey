precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  vec3 color = vec3(0.0, 0.0, 0.02);

  // TODO: 多层星空循环
  // for (int i = 0; i < 4; i++) {
  //   缩放 + 偏移 uv
  //   分格 floor/fract
  //   每格中心偏移 = hash(id)
  //   星星亮度 = smoothstep(size, 0, distance)
  // }

  gl_FragColor = vec4(color, 1.0);
}
