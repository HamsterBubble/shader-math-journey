precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  // TODO: u_mouse 是像素坐标（左下原点），把它换算到与 p 同一套 NDC 空间：
  // 先归一化到 0–1，再 * 2.0 - 1.0，最后用宽高比校正 x
  vec2 mouseNDC = u_mouse / u_resolution;

  float dist = length(p - mouseNDC);
  float mouseSize = 0.6;
  float phase = clamp(dist * 3.14159265 / mouseSize, 0.0, 3.14159265);
  float bump = (cos(phase) + 1.0) * 0.5;

  vec3 deep = vec3(0.03, 0.09, 0.16);
  vec3 crest = vec3(0.55, 0.85, 1.0);
  vec3 color = mix(deep, crest, bump);

  gl_FragColor = vec4(color, 1.0);
}
