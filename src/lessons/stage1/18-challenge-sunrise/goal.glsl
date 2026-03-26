precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  // 太阳位置: 缓慢上升
  float sunY = 0.25 + sin(u_time * 0.3) * 0.15;
  vec2 sunPos = vec2(0.5 * u_resolution.x / u_resolution.y, sunY);

  // 天空渐变
  vec3 skyTop = vec3(0.1, 0.1, 0.35);
  vec3 skyMid = vec3(0.8, 0.4, 0.2);
  vec3 skyBot = vec3(1.0, 0.6, 0.1);
  vec3 sky = mix(skyBot, skyMid, smoothstep(0.0, 0.4, uv.y));
  sky = mix(sky, skyTop, smoothstep(0.4, 1.0, uv.y));

  // 太阳
  float sunDist = length(uv - sunPos);
  float sun = smoothstep(0.08, 0.07, sunDist);
  vec3 sunColor = vec3(1.0, 0.95, 0.8);

  // 光晕
  float glow = exp(-sunDist * 5.0) * 0.6;
  vec3 glowColor = vec3(1.0, 0.6, 0.2);

  // 地面
  float ground = smoothstep(0.22, 0.2, uv.y);
  vec3 groundColor = vec3(0.05, 0.08, 0.05);

  vec3 color = sky;
  color += glowColor * glow;
  color = mix(color, sunColor, sun);
  color = mix(color, groundColor, ground);

  gl_FragColor = vec4(color, 1.0);
}
