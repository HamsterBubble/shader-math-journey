precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;
  float d = length(uv) - 0.6;
  float mask = smoothstep(0.01, -0.01, d);
  float z = sqrt(max(0.36 - uv.x*uv.x - uv.y*uv.y, 0.0));
  vec3 N = normalize(vec3(uv, z));
  vec3 L = normalize(vec3(cos(u_time*0.5), sin(u_time*0.5), 0.8));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 R = reflect(-L, N);
  float diffuse = max(dot(N, L), 0.0);
  float specular = pow(max(dot(R, V), 0.0), 32.0);
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  vec3 base = vec3(0.2, 0.5, 1.0);
  vec3 col = base*(0.08+0.8*diffuse) + vec3(1.0)*specular*0.6 + vec3(0.3,0.5,1.0)*fresnel*0.4;
  vec3 color = mix(vec3(0.03), col, mask);
  color += base * 0.06 * exp(-abs(d) * 10.0);
  gl_FragColor = vec4(color, 1.0);
}
