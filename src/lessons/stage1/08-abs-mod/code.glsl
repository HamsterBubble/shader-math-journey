precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // abs() 镜像对称
  vec2 mirror = abs(uv);

  // 用 mirror 坐标画 V 形
  float v_shape = smoothstep(0.02, 0.0, abs(mirror.y - mirror.x * 0.8) - 0.01);

  // mod() 重复条纹
  float stripes = mod(uv.x * 8.0 + u_time, 2.0);
  float stripe_mask = step(1.0, stripes); // 奇偶交替

  // 棋盘格
  vec2 grid = floor((uv + 1.0) * 4.0);
  float checker = mod(grid.x + grid.y, 2.0);

  vec3 color = vec3(0.03);
  color = mix(color, vec3(0.15, 0.05, 0.2) + vec3(0.2) * checker, 0.5);
  color = mix(color, vec3(0.3, 0.6, 1.0) * stripe_mask, 0.3);
  color += vec3(0.9, 0.3, 0.5) * v_shape;

  gl_FragColor = vec4(color, 1.0);
}
