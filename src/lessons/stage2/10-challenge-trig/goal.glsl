precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;
  float r = length(uv);
  float angle = atan(uv.y, uv.x);
  float arms = 3.0;
  float spiral = fract((angle / 6.283 * arms + r * 3.0 - u_time * 0.3));
  float line = smoothstep(0.08, 0.0, abs(spiral - 0.5) - 0.15);
  float fade = smoothstep(1.2, 0.0, r);
  float hue = angle / 6.283 + 0.5;
  vec3 col = vec3(sin(hue*6.283)*0.5+0.5, sin(hue*6.283+2.094)*0.5+0.5, sin(hue*6.283+4.189)*0.5+0.5);
  vec3 color = vec3(0.03);
  color += col * line * fade;
  color += col * 0.05 * exp(-r * 4.0);
  gl_FragColor = vec4(color, 1.0);
}
