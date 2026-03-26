precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float d = length(uv) - 0.7;
  if (d > 0.01) {
    gl_FragColor = vec4(vec3(0.03), 1.0);
    return;
  }

  // 3D 球面法线 (z 从 SDF 推导)
  float z = sqrt(max(0.49 - uv.x*uv.x - uv.y*uv.y, 0.0));
  vec3 N = normalize(vec3(uv, z));

  // 光源 & 视线
  vec3 L = normalize(vec3(cos(u_time), sin(u_time), 1.0));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 R = reflect(-L, N);

  // Phong 三分量
  float ambient = 0.08;
  float diffuse = max(dot(N, L), 0.0);
  float shininess = 32.0;
  float specular = pow(max(dot(R, V), 0.0), shininess);

  vec3 baseColor = vec3(0.8, 0.2, 0.3);
  vec3 color = baseColor * (ambient + diffuse * 0.8) + vec3(1.0) * specular;

  // 菲涅尔边缘光
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  color += vec3(0.3, 0.5, 1.0) * fresnel * 0.5;

  gl_FragColor = vec4(color, 1.0);
}
