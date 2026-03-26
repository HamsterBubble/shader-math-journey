precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float r = length(uv);
  float angle = atan(uv.y, uv.x); // [-PI, PI]

  // 归一化角度到 [0, 1]
  float a = angle / 6.283 + 0.5;

  // === 扇形可视化 ===
  float segments = 8.0;
  float sector = floor(a * segments);
  float sectorFrac = fract(a * segments);

  // 每个扇区不同色相
  float hue = sector / segments;
  vec3 sectorColor = vec3(
    sin(hue * 6.283) * 0.5 + 0.5,
    sin(hue * 6.283 + 2.094) * 0.5 + 0.5,
    sin(hue * 6.283 + 4.189) * 0.5 + 0.5
  );

  // 扇区边界线
  float border = smoothstep(0.02, 0.0, min(sectorFrac, 1.0 - sectorFrac));

  // 中心衰减
  float fade = smoothstep(1.2, 0.0, r);

  vec3 color = sectorColor * fade * 0.7;
  color = mix(color, vec3(1.0), border * 0.5 * fade);

  // 中心角度指示点
  vec2 pointer = vec2(cos(u_time), sin(u_time)) * 0.15;
  color += vec3(1.0, 0.9, 0.3) * smoothstep(0.03, 0.01, length(uv - pointer));

  gl_FragColor = vec4(color, 1.0);
}
