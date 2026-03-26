precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  vec3 color = vec3(0.03);

  // 画单位圆
  float circle = abs(length(uv) - 0.6) - 0.005;
  color += vec3(0.2, 0.3, 0.4) * smoothstep(0.01, 0.0, circle);

  // 轴线
  float xAxis = smoothstep(0.005, 0.0, abs(uv.y));
  float yAxis = smoothstep(0.005, 0.0, abs(uv.x));
  color += vec3(0.15) * (xAxis + yAxis);

  // 圆上的运动点
  float angle = u_time;
  vec2 point = vec2(cos(angle), sin(angle)) * 0.6;
  float dot_d = length(uv - point);
  color += vec3(1.0, 0.4, 0.3) * smoothstep(0.03, 0.01, dot_d);

  // cos 投影线 (水平)
  float cosLine = smoothstep(0.004, 0.0,
    abs(uv.y - point.y) * step(min(0.0, point.x), uv.x) * step(uv.x, max(0.0, point.x))
  );
  color += vec3(0.3, 0.8, 0.4) * smoothstep(0.004, 0.0, abs(uv.y - point.y))
    * step(min(0.0, point.x), uv.x) * step(uv.x, max(0.0, point.x));

  // sin 投影线 (竖直)
  color += vec3(0.4, 0.5, 1.0) * smoothstep(0.004, 0.0, abs(uv.x - point.x))
    * step(min(0.0, point.y), uv.y) * step(uv.y, max(0.0, point.y));

  // 标注 cos(θ) 和 sin(θ) 的长度条
  // cos = 绿色水平条
  float cosBar = smoothstep(0.015, 0.0, abs(uv.y + 0.75))
    * step(0.0, uv.x) * step(uv.x, cos(angle) * 0.6);
  color += vec3(0.3, 0.9, 0.4) * cosBar;

  // sin = 蓝色竖直条
  float sinBar = smoothstep(0.015, 0.0, abs(uv.x - 0.85))
    * step(0.0, uv.y) * step(uv.y, sin(angle) * 0.6);
  color += vec3(0.4, 0.5, 1.0) * sinBar;

  gl_FragColor = vec4(color, 1.0);
}
