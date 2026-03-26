precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 光源方向 (随时间旋转)
  vec2 lightDir = normalize(vec2(cos(u_time), sin(u_time)));

  // 圆的 SDF
  float d = length(uv) - 0.6;
  float circle = smoothstep(0.01, -0.01, d);

  // 对圆内的像素计算"法线"（球面法线近似）
  vec2 normal = normalize(uv);

  // 点积 = 光照！
  float diffuse = max(dot(normal, lightDir), 0.0);

  // 着色
  vec3 baseColor = vec3(0.3, 0.6, 1.0);
  vec3 litColor = baseColor * (0.15 + 0.85 * diffuse);

  vec3 color = mix(vec3(0.03), litColor, circle);
  color += baseColor * 0.08 * exp(-abs(d) * 10.0);

  gl_FragColor = vec4(color, 1.0);
}
