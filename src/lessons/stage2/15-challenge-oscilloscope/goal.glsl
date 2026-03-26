precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 示波器网格
  vec2 gridUV = fract(uv * 5.0);
  float grid = smoothstep(0.02, 0.0, min(gridUV.x, gridUV.y));
  grid += smoothstep(0.01, 0.0, min(abs(uv.x), abs(uv.y))) * 2.0;

  // 叠加波形
  float wave1 = 0.4 * sin(uv.x * 8.0 + u_time * 3.0);
  float wave2 = 0.15 * sin(uv.x * 20.0 + u_time * 5.0);
  float wave3 = 0.08 * sin(uv.x * 35.0 - u_time * 2.0);
  float wave = wave1 + wave2 + wave3;

  float line = smoothstep(0.025, 0.0, abs(uv.y - wave));
  float glow = exp(-abs(uv.y - wave) * 15.0) * 0.3;

  vec3 color = vec3(0.02, 0.05, 0.02);
  color += vec3(0.0, 0.3, 0.0) * grid * 0.2;
  color += vec3(0.2, 1.0, 0.3) * line;
  color += vec3(0.1, 0.6, 0.2) * glow;

  gl_FragColor = vec4(color, 1.0);
}
