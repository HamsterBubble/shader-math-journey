precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;
  float angle = u_time * 0.5;
  float c = cos(angle), s = sin(angle);
  vec2 translate = vec2(sin(u_time*0.3)*0.3, cos(u_time*0.4)*0.2);
  vec2 tuv = mat2(c/0.8, -s/0.8, s/0.8, c/0.8) * (uv - translate);
  float box = max(abs(tuv.x), abs(tuv.y)) - 0.3;
  float shape = smoothstep(0.01, -0.01, box);
  vec2 gridUV = fract(tuv * 3.0);
  float grid = smoothstep(0.03, 0.0, min(gridUV.x, gridUV.y));
  vec3 color = vec3(0.05);
  color += vec3(0.3, 0.7, 0.9) * shape;
  color += vec3(0.5) * grid * shape * 0.3;
  gl_FragColor = vec4(color, 1.0);
}
