precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 圆形 SDF
  float r = 0.6;
  float d = length(uv) - r;
  float sphere = smoothstep(0.01, -0.01, d);

  // 表面法线
  vec2 normal = normalize(uv);

  // 视线方向（从屏幕看进去）
  vec2 viewDir = vec2(0.0, 0.0) - uv;

  // 菲涅尔效果：dot(normal, viewDir) 在边缘接近 0
  float NdotV = max(dot(normal, -normalize(uv)), 0.0);
  float fresnel = pow(1.0 - NdotV, 3.0);

  // 基础颜色
  vec3 baseColor = vec3(0.1, 0.2, 0.5);

  // 边缘光
  vec3 rimColor = vec3(0.3, 0.7, 1.0);
  vec3 litColor = baseColor + rimColor * fresnel;

  vec3 color = mix(vec3(0.03), litColor, sphere);
  color += rimColor * fresnel * sphere * 0.5;

  gl_FragColor = vec4(color, 1.0);
}
