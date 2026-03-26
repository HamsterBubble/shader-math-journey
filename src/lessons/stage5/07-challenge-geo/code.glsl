precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float sdCircle(vec2 p, float r) { return length(p) - r; }
float sdBox(vec2 p, vec2 s) {
  vec2 d = abs(p) - s;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 你的 SDF 图标代码写在这里...
  // 示例思路：笑脸
  // - 大圆做脸
  // - 两个小圆做眼睛（差集挖洞）
  // - 半圆做嘴巴

  vec3 color = vec3(0.03);

  gl_FragColor = vec4(color, 1.0);
}
