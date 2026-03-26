precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float f(vec2 p) {
  return sin(p.x * 3.0) * cos(p.y * 3.0);
}

vec2 gradient(vec2 p) {
  float eps = 0.01;
  return vec2(
    f(p + vec2(eps, 0.0)) - f(p - vec2(eps, 0.0)),
    f(p + vec2(0.0, eps)) - f(p - vec2(0.0, eps))
  ) / (2.0 * eps);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 函数值 → 底色
  float val = f(uv + vec2(u_time * 0.2)) * 0.5 + 0.5;
  vec3 color = mix(vec3(0.05, 0.0, 0.15), vec3(0.1, 0.4, 0.6), val);

  // 等值线
  float contour = abs(fract(f(uv + vec2(u_time * 0.2)) * 4.0) - 0.5);
  color += vec3(0.5) * smoothstep(0.05, 0.02, contour) * 0.3;

  // 网格梯度箭头
  float grid = 8.0;
  vec2 cellUV = fract(uv * grid) - 0.5;
  vec2 cellCenter = (floor(uv * grid) + 0.5) / grid;
  vec2 grad = gradient(cellCenter + vec2(u_time * 0.2));
  vec2 dir = normalize(grad);
  float mag = length(grad);

  // 画箭头：线段
  float proj = dot(cellUV, dir);
  float perp = abs(dot(cellUV, vec2(-dir.y, dir.x)));
  float arrow = smoothstep(0.03, 0.01, perp) *
                step(0.0, proj) * step(proj, mag * 0.8);
  color += vec3(1.0, 0.8, 0.2) * arrow;

  gl_FragColor = vec4(color, 1.0);
}
