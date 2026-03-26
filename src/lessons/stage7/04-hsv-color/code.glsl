precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

vec3 hsv2rgb(vec3 c) {
  vec3 rgb = clamp(
    abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
    0.0, 1.0
  );
  return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // 色相环
  vec2 centered = uv * 2.0 - 1.0;
  centered.x *= u_resolution.x / u_resolution.y;

  float angle = atan(centered.y, centered.x);
  float r = length(centered);

  float hue = angle / 6.283 + 0.5; // 0~1
  float hueOffset = u_time * 0.1;
  float sat = r;
  float val = 1.0;

  vec3 color = hsv2rgb(vec3(hue + hueOffset, min(sat, 1.0), val));

  // 中心白点
  color = mix(vec3(1.0), color, smoothstep(0.0, 0.15, r));

  gl_FragColor = vec4(color, 1.0);
}
