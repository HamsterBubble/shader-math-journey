precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, s, -s, c);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // TODO: 万花筒折叠
  // 提示: 用循环多次 rotate + abs
  // float foldAngle = 3.14159 / 6.0;
  // for (int i = 0; i < 6; i++) {
  //   uv = rot(foldAngle) * uv;
  //   uv = abs(uv);
  // }

  vec3 color = vec3(0.03);

  // 你的代码写在这里...

  gl_FragColor = vec4(color, 1.0);
}
