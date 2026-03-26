precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;
  float r = length(uv);
  float theta = atan(uv.y, uv.x);
  float spiral = theta + r * 10.0 - u_time * 2.0;
  float pattern = sin(spiral * 3.0) * 0.5 + 0.5;
  vec3 color = mix(vec3(0.1,0.2,0.5), vec3(0.9,0.4,0.2), pattern);
  color *= smoothstep(1.2, 0.3, r);
  gl_FragColor = vec4(color, 1.0);
}
