precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float sampleHeight(vec2 uv) {
  return sin(uv.x * 45.0 + u_time * 2.0) * sin(uv.y * 45.0 - u_time * 1.6) * 0.25;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 cell = 1.0 / u_resolution;

  float curr = sampleHeight(uv);
  float prev = sampleHeight(uv + vec2(u_time * 0.015, u_time * 0.01));

  float north = sampleHeight(uv + vec2(0.0, cell.y));
  float south = sampleHeight(uv - vec2(0.0, cell.y));
  float east = sampleHeight(uv + vec2(cell.x, 0.0));
  float west = sampleHeight(uv - vec2(cell.x, 0.0));

  float viscosity = 0.89;
  // TODO: 还原真实水面更新式：
  // ((north + south + east + west) * 0.5 - prev) * viscosity
  float newHeight = curr * 0.96;

  vec2 mouse = u_mouse / u_resolution;
  mouse = mouse * 2.0 - 1.0;
  mouse.x *= u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  float mousePhase = clamp(length(p - mouse) * 3.14159265 / 0.6, 0.0, 3.14159265);
  newHeight += (cos(mousePhase) + 1.0) * 0.5 * 0.35;

  vec3 deep = vec3(0.03, 0.09, 0.16);
  vec3 crest = vec3(0.55, 0.85, 1.0);
  vec3 color = mix(deep, crest, newHeight * 0.5 + 0.5);

  gl_FragColor = vec4(color, 1.0);
}
