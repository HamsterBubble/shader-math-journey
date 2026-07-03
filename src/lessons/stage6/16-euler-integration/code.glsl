precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

void main() {
  vec2 uv = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 解析欧拉积分：a = (sin t, cos t) → p 沿圆轨迹
  vec2 accel = vec2(sin(u_time), cos(u_time)) * 0.8;
  vec2 pos = -accel; // ∫∫ a dt² 的简化演示（圆心偏移）

  float d = length(uv - pos);
  float particle = smoothstep(0.06, 0.04, d);

  vec2 tangent = normalize(vec2(cos(u_time), -sin(u_time)));
  vec2 rel = uv - pos;
  float along = dot(rel, tangent);
  float across = abs(dot(rel, vec2(-tangent.y, tangent.x)));
  float arrowBody = smoothstep(0.018, 0.0, across) * smoothstep(-0.02, 0.02, along) * smoothstep(0.28, 0.20, along);
  float arrowHead = smoothstep(0.08, 0.0, length(rel - tangent * 0.28));
  float orbit = smoothstep(0.018, 0.0, abs(length(uv) - 0.8));

  vec3 color = vec3(0.06, 0.08, 0.12);
  color += vec3(0.12, 0.25, 0.45) * orbit;
  color += vec3(0.3, 0.8, 1.0) * arrowBody;
  color += vec3(1.0, 0.82, 0.35) * arrowHead;
  color += vec3(1.0, 0.5, 0.2) * particle;

  gl_FragColor = vec4(color, 1.0);
}
