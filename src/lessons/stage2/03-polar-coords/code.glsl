precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 转换到极坐标
  float r = length(uv);       // 距离
  float angle = atan(uv.y, uv.x);  // 角度

  // 用 sin(角度 * N) 创建花瓣
  float petals = 6.0;
  float flower = 0.5 + 0.3 * sin(angle * petals);

  // 花瓣形状: r < flower 的区域是内部
  float shape = smoothstep(0.02, -0.02, r - flower);

  // 用角度上色
  float hue = angle / 6.283 + 0.5;  // 0~1
  vec3 fg = vec3(
    sin(hue * 6.283) * 0.5 + 0.5,
    sin(hue * 6.283 + 2.094) * 0.5 + 0.5,
    sin(hue * 6.283 + 4.189) * 0.5 + 0.5
  );

  vec3 color = mix(vec3(0.03), fg, shape);
  // 中心辉光
  color += fg * 0.1 * exp(-r * 5.0);

  gl_FragColor = vec4(color, 1.0);
}
