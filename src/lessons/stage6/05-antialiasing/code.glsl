precision mediump float;
#extension GL_OES_standard_derivatives : enable
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  vec3 color = vec3(0.03);

  // 多条斜线 (最能暴露锯齿的场景)
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float angle = 0.2 + fi * 0.3;
    vec2 dir = vec2(cos(angle), sin(angle));
    float d = abs(dot(uv - vec2(-0.8 + fi * 0.35, 0.0), vec2(-dir.y, dir.x)));

    // 有 AA
    float fw = fwidth(d);
    float line = smoothstep(fw, 0.0, d - 0.008);

    float hue = fi * 0.2 + u_time * 0.1;
    vec3 lineCol = vec3(
      sin(hue * 6.283) * 0.5 + 0.5,
      sin(hue * 6.283 + 2.094) * 0.5 + 0.5,
      sin(hue * 6.283 + 4.189) * 0.5 + 0.5
    );
    color += lineCol * line;
  }

  // 同心圆 (高频细节)
  float r = length(uv);
  float rings = sin(r * 50.0);
  float fw_rings = fwidth(rings);
  float aa_rings = smoothstep(fw_rings, -fw_rings, rings);
  color += vec3(0.15, 0.25, 0.4) * aa_rings * smoothstep(1.0, 0.3, r);

  gl_FragColor = vec4(color, 1.0);
}
