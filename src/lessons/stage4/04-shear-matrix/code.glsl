precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate2d(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, s, -s, c);
}

mat2 shear(float shx, float shy) {
  return mat2(1.0, shy, shx, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 动态剪切
  float sh = sin(u_time) * 0.5;
  uv = shear(sh, 0.0) * uv;

  // 画网格
  vec2 grid = fract(uv * 3.0 + 0.5) - 0.5;
  float box = max(abs(grid.x), abs(grid.y)) - 0.35;
  float shape = smoothstep(0.01, -0.01, box);

  vec2 cellID = floor(uv * 3.0 + 0.5);
  float hue = (cellID.x + cellID.y) * 0.2;
  vec3 cellColor = vec3(
    sin(hue * 6.283) * 0.5 + 0.5,
    sin(hue * 6.283 + 2.094) * 0.5 + 0.5,
    sin(hue * 6.283 + 4.189) * 0.5 + 0.5
  );

  vec3 color = mix(vec3(0.03), cellColor * 0.8, shape);
  gl_FragColor = vec4(color, 1.0);
}
