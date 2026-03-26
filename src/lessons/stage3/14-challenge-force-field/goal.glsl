precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;
  float r = length(uv);
  float theta = atan(uv.y, uv.x);
  float shieldR = 0.6;
  float d = abs(r - shieldR);
  // 菲涅尔边缘光
  float fresnel = pow(1.0 - abs(r - shieldR) * 5.0, 3.0) * step(r, shieldR + 0.1) * step(shieldR - 0.1, r);
  // 扩散波纹
  float wave = sin(r * 30.0 - u_time * 5.0) * 0.5 + 0.5;
  wave *= smoothstep(0.15, 0.0, d);
  // 六角纹理
  float hex = sin(theta * 6.0) * sin(r * 20.0);
  hex = smoothstep(0.3, 0.5, hex) * smoothstep(0.12, 0.0, d);
  vec3 shieldColor = vec3(0.2, 0.6, 1.0);
  vec3 color = vec3(0.02);
  color += shieldColor * fresnel * 0.8;
  color += shieldColor * wave * 0.4;
  color += vec3(0.3, 0.8, 1.0) * hex * 0.3;
  color += shieldColor * 0.05 * exp(-d * 15.0);
  gl_FragColor = vec4(color, 1.0);
}
