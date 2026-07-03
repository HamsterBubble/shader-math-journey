precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

vec3 fakeNormal(vec2 uv) {
  float hx = sin(uv.x * 22.0 + u_time * 0.9) * cos(uv.y * 16.0 - u_time * 0.7);
  float hy = cos(uv.x * 18.0 - u_time * 0.6) * sin(uv.y * 20.0 + u_time * 0.8);
  return normalize(vec3(hx * 0.75, hy * 0.75, 1.0)) * 0.5 + 0.5;
}

float backgroundPattern(vec2 uv) {
  return 0.5 + 0.5 * sin(uv.x * 40.0) * sin(uv.y * 30.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  vec3 nTex = fakeNormal(uv + u_time * 0.05);
  vec3 n = nTex * 2.0 - 1.0;
  float strength = 0.035;
  vec2 sampleUV = uv + n.xy * strength;

  float raw = backgroundPattern(uv);
  float distorted = backgroundPattern(sampleUV);

  vec3 lightDir = normalize(vec3(1.0, 1.2, 0.0));
  float alignment = max(0.0, dot(normalize(vec3(n.xy, 1.0)), lightDir));
  float highlight = pow(smoothstep(0.65, 0.95, alignment), 2.5);

  vec3 rawColor = vec3(raw * 0.25);
  vec3 distortedColor = mix(vec3(0.02, 0.06, 0.11), vec3(0.35, 0.75, 0.95), distorted);
  distortedColor += vec3(1.0, 0.98, 0.9) * highlight * 0.63;

  vec2 centered = gl_FragCoord.xy / u_resolution.xy - 0.5;
  float distFromCenter = length(centered);
  float vignette = smoothstep(0.5, 0.4, distFromCenter);
  distortedColor = mix(vec3(0.0), distortedColor, vignette);

  vec3 color = mix(rawColor, distortedColor, step(0.5, gl_FragCoord.x / u_resolution.x));
  float divider = smoothstep(0.004, 0.0, abs(gl_FragCoord.x / u_resolution.x - 0.5));
  color += vec3(0.8, 0.9, 1.0) * divider;

  gl_FragColor = vec4(color, 1.0);
}
