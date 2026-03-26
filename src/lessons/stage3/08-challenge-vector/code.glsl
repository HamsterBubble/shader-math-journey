precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float radius = 0.6;
  float d = length(uv) - radius;
  float mask = smoothstep(0.01, -0.01, d);

  vec2 lightDir = normalize(vec2(cos(u_time * 0.5), sin(u_time * 0.5)));

  // TODO: 计算法线、漫反射、高光

  vec3 baseColor = vec3(0.2, 0.5, 1.0);
  vec3 color = mix(vec3(0.03), baseColor, mask);

  gl_FragColor = vec4(color, 1.0);
}
