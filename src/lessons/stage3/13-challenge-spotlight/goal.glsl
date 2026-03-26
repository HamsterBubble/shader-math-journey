precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;
  vec2 lightPos = vec2(sin(u_time*0.5)*0.5, 0.6);
  vec2 lightDir = normalize(vec2(0.0, -1.0));
  vec2 toPixel = normalize(uv - lightPos);
  float spotAngle = dot(toPixel, lightDir);
  float spot = pow(max(spotAngle, 0.0), 20.0);
  float dist = length(uv - lightPos);
  float atten = 1.0 / (1.0 + dist * 2.0);
  float light = spot * atten;
  vec3 groundColor = vec3(0.15, 0.12, 0.1);
  float ground = smoothstep(0.0, -0.1, uv.y);
  vec3 color = groundColor * ground * light * 3.0;
  color += vec3(1.0, 0.9, 0.7) * spot * 0.05;
  float src = smoothstep(0.05, 0.03, length(uv - lightPos));
  color += vec3(1.0, 0.95, 0.8) * src;
  gl_FragColor = vec4(color, 1.0);
}
