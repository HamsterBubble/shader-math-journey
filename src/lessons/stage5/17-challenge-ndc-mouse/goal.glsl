precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  vec2 mouseNDC = u_mouse / u_resolution;
  mouseNDC = mouseNDC * 2.0 - 1.0;
  mouseNDC.x *= u_resolution.x / u_resolution.y;

  float dist = length(p - mouseNDC);
  float mouseSize = 0.6;
  float phase = clamp(dist * 3.14159265 / mouseSize, 0.0, 3.14159265);
  float bump = (cos(phase) + 1.0) * 0.5;

  vec3 deep = vec3(0.03, 0.09, 0.16);
  vec3 crest = vec3(0.55, 0.85, 1.0);
  vec3 color = mix(deep, crest, bump);

  gl_FragColor = vec4(color, 1.0);
}
