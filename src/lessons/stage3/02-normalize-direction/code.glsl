precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 该像素到原点的方向 (单位向量)
  vec2 dir = normalize(uv);

  // 把方向映射到颜色 (-1~1 → 0~1)
  vec3 color = vec3(dir * 0.5 + 0.5, 0.5);

  // 在中心画个十字参考线
  float cross = smoothstep(0.008, 0.0, abs(uv.x));
  cross += smoothstep(0.008, 0.0, abs(uv.y));
  color = mix(color, vec3(1.0), cross * 0.3);

  gl_FragColor = vec4(color, 1.0);
}
