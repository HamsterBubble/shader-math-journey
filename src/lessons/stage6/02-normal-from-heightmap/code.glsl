precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float height(vec2 p) {
  return sin(p.x * 8.0 + u_time) * sin(p.y * 6.0 + u_time * 0.7) * 0.5;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 数值法线：在 x,y 方向各求偏导
  float eps = 0.01;
  float h  = height(uv);
  float hx = height(uv + vec2(eps, 0.0));
  float hy = height(uv + vec2(0.0, eps));

  float strength = 0.1;
  vec3 normal = normalize(vec3(h - hx, h - hy, strength));

  // 光照
  vec3 lightDir = normalize(vec3(cos(u_time * 0.5), sin(u_time * 0.5), 0.8));
  float diffuse = max(dot(normal, lightDir), 0.0);

  // 高光
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 refl = reflect(-lightDir, normal);
  float spec = pow(max(dot(refl, viewDir), 0.0), 32.0);

  vec3 baseColor = vec3(0.3, 0.5, 0.8);
  vec3 color = baseColor * (0.1 + 0.7 * diffuse) + vec3(1.0) * spec * 0.5;

  gl_FragColor = vec4(color, 1.0);
}
