precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 圆形轨道
  float orbitRadius = 0.5;
  vec2 center = vec2(
    orbitRadius * cos(u_time),
    orbitRadius * sin(u_time)
  );

  // 画移动的圆
  float d = length(uv - center);
  float ball = smoothstep(0.08, 0.06, d);

  // 轨道环
  float orbit = smoothstep(0.005, 0.0, abs(length(uv) - orbitRadius));

  // 拖尾（前几帧的残影）
  float trail = 0.0;
  for (int i = 1; i < 8; i++) {
    float t = u_time - float(i) * 0.08;
    vec2 p = vec2(orbitRadius * cos(t), orbitRadius * sin(t));
    trail += smoothstep(0.06, 0.04, length(uv - p)) * (1.0 - float(i) / 8.0);
  }

  vec3 color = vec3(0.03);
  color += vec3(0.15, 0.15, 0.3) * orbit;
  color += vec3(0.2, 0.5, 1.0) * trail * 0.3;
  color += vec3(0.3, 0.7, 1.0) * ball;

  gl_FragColor = vec4(color, 1.0);
}
