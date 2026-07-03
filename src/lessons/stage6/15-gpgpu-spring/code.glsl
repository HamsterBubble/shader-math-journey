precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  vec2 mouse = u_mouse / u_resolution;
  mouse = mouse * 2.0 - 1.0;
  mouse.x *= u_resolution.x / u_resolution.y;

  vec2 anchor = vec2(0.0, -0.1);
  float k = 2.0;
  float push = 0.08;

  vec2 toMouse = anchor - mouse;
  float distToMouse = max(length(toMouse), 0.12);
  vec2 repel = normalize(toMouse) * push / (distToMouse * distToMouse);
  vec2 particlePos = anchor + repel / k;
  particlePos += sin(u_time * 4.0) * 0.02 * normalize(particlePos - anchor + vec2(0.001));

  vec3 color = vec3(0.05, 0.06, 0.1);

  vec2 ap = particlePos - anchor;
  float t = clamp(dot(p - anchor, ap) / dot(ap, ap), 0.0, 1.0);
  float lineDist = length(p - (anchor + ap * t));
  float springLine = smoothstep(0.018, 0.006, lineDist);
  float dotAnchor = smoothstep(0.045, 0.03, length(p - anchor));
  float dotParticle = smoothstep(0.06, 0.04, length(p - particlePos));
  float mouseRing = smoothstep(0.22, 0.20, abs(length(p - mouse) - 0.2));

  color += vec3(0.2, 0.45, 0.85) * springLine;
  color += vec3(0.65, 0.8, 1.0) * dotAnchor;
  color += vec3(1.0, 0.58, 0.24) * dotParticle;
  color += vec3(0.25, 0.7, 1.0) * mouseRing * 0.5;

  gl_FragColor = vec4(color, 1.0);
}
