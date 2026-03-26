precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // "3D" 球面 (用 2D 模拟)
  float d = length(uv);
  if (d > 0.7) {
    gl_FragColor = vec4(vec3(0.03), 1.0);
    return;
  }

  // 从 2D 推导 3D 法线
  float z = sqrt(max(0.49 - uv.x*uv.x - uv.y*uv.y, 0.0));
  vec3 N = normalize(vec3(uv, z));

  // 光源方向
  vec3 L = normalize(vec3(cos(u_time), sin(u_time * 0.7), 1.5));

  // 反射计算（手动 vs 内置对比）
  vec3 I = -L; // 入射方向
  vec3 R_manual = I - 2.0 * dot(I, N) * N;
  // vec3 R_builtin = reflect(I, N); // 等价！

  // 视线方向
  vec3 V = vec3(0.0, 0.0, 1.0);

  // 漫反射
  float diff = max(dot(N, L), 0.0);

  // 镜面反射 (反射光 vs 视线)
  float spec = pow(max(dot(R_manual, V), 0.0), 32.0);

  vec3 color = vec3(0.2, 0.4, 0.8) * (0.1 + diff * 0.7)
             + vec3(1.0) * spec;

  // 菲涅尔边缘光
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  color += vec3(0.3, 0.5, 1.0) * fresnel * 0.4;

  gl_FragColor = vec4(color, 1.0);
}
