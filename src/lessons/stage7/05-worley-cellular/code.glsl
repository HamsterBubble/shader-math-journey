precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  float scale = 5.0;
  vec2 st = uv * scale;
  vec2 i_st = floor(st);
  vec2 f_st = fract(st);

  float minDist1 = 1.0; // F1
  float minDist2 = 1.0; // F2

  // 遍历 3x3 邻居格子
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      // 每格中的随机点
      vec2 point = hash22(i_st + neighbor);
      // 让点微动
      point = 0.5 + 0.5 * sin(u_time * 0.5 + point * 6.283);

      vec2 diff = neighbor + point - f_st;
      float dist = length(diff);

      // 记录最近和次近距离
      if (dist < minDist1) {
        minDist2 = minDist1;
        minDist1 = dist;
      } else if (dist < minDist2) {
        minDist2 = dist;
      }
    }
  }

  // 可视化 (试试不同模式!)
  float f = minDist1;          // F1: 细胞
  // float f = minDist2;       // F2: 更复杂
  // float f = minDist2 - minDist1; // 边缘网络

  vec3 color = vec3(f);
  // 着色
  color = mix(vec3(0.1, 0.3, 0.5), vec3(0.9, 0.8, 0.6), f);
  // 边缘高亮
  float edge = smoothstep(0.05, 0.0, minDist2 - minDist1);
  color = mix(color, vec3(1.0), edge * 0.5);

  gl_FragColor = vec4(color, 1.0);
}
