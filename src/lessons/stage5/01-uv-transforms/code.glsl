precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  // 步骤1: 归一化 [0, 1]
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // 步骤2: 居中到 [-1, 1]
  uv = uv * 2.0 - 1.0;

  // 步骤3: 宽高比修正
  uv.x *= u_resolution.x / u_resolution.y;

  // 画同心环——验证坐标是否正确
  float d = length(uv);
  float rings = sin(d * 20.0 - u_time * 3.0) * 0.5 + 0.5;
  rings *= smoothstep(1.2, 0.2, d); // 外圈渐隐

  vec3 color = mix(
    vec3(0.05, 0.0, 0.1),
    vec3(0.2, 0.5, 1.0),
    rings
  );

  gl_FragColor = vec4(color, 1.0);
}
