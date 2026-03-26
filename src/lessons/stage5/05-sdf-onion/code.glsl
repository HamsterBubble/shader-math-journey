precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float sdBox(vec2 p, vec2 s) {
  vec2 d = abs(p) - s;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float base = sdBox(uv, vec2(0.4, 0.3));

  // 洋葱皮: 多层嵌套环
  float onion1 = abs(base) - 0.06;
  float onion2 = abs(onion1) - 0.03;
  float onion3 = abs(onion2) - 0.015;

  float d = onion3;

  // 偏移 (圆角化) — 整体向外扩 0.01
  d -= 0.01;

  float shape = smoothstep(0.008, -0.008, d);
  float glow = exp(-abs(base) * 8.0) * 0.3;

  // 颜色: 根据到原始形状的距离着色
  float t = abs(base);
  vec3 col = vec3(
    sin(t * 30.0) * 0.5 + 0.5,
    sin(t * 30.0 + 2.0) * 0.5 + 0.5,
    sin(t * 30.0 + 4.0) * 0.5 + 0.5
  );

  vec3 color = vec3(0.02);
  color = mix(color, col * 0.8, shape);
  color += vec3(0.3, 0.5, 1.0) * glow;

  gl_FragColor = vec4(color, 1.0);
}
