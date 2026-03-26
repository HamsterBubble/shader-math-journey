precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float r = length(uv);
  float theta = atan(uv.y, uv.x);

  // 花瓣
  float petals = 5.0;
  float petalR = 0.5 + 0.2 * cos(petals * theta + u_time);
  float petal = smoothstep(0.02, -0.02, r - petalR);

  // 花心
  float center = smoothstep(0.15, 0.12, r);

  // 颜色
  float hue = theta / 6.2832 + 0.5;
  vec3 petalColor = mix(vec3(1.0, 0.3, 0.5), vec3(0.8, 0.2, 0.9), hue);
  vec3 centerColor = vec3(1.0, 0.9, 0.3);

  vec3 color = vec3(0.05, 0.1, 0.05);
  color = mix(color, petalColor, petal);
  color = mix(color, centerColor, center);

  // 光晕
  color += petalColor * 0.1 * exp(-abs(r - petalR) * 8.0);

  gl_FragColor = vec4(color, 1.0);
}
