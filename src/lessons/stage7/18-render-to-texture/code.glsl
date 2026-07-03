precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float state(vec2 uv) {
  return sin(uv.x * 24.0 + u_time * 1.2) * sin(uv.y * 18.0 - u_time * 0.8);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 cell = 1.0 / u_resolution.xy * 80.0;

  float center = state(uv);

  float north = state(uv + vec2(0.0, cell.y));
  float south = state(uv - vec2(0.0, cell.y));
  float east = state(uv + vec2(cell.x, 0.0));
  float west = state(uv - vec2(cell.x, 0.0));
  float blur = (north + south + east + west) * 0.25;
  float nextState = mix(center, blur, 0.45);

  vec3 color = vec3(0.08);
  color += vec3(0.2, 0.5, 0.9) * (nextState * 0.5 + 0.5);
  color += vec3(0.9, 0.95, 1.0) * abs(center - blur) * 0.65;

  gl_FragColor = vec4(color, 1.0);
}
