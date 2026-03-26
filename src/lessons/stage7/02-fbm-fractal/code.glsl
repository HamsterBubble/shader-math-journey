precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i+vec2(1,0));
  float c = hash(i+vec2(0,1)), d = hash(i+vec2(1,1));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 6; i++) {
    value += amplitude * noise(p);
    p *= 2.0;       // 频率翻倍
    amplitude *= 0.5; // 振幅减半
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  float n = fbm(uv * 3.0 + u_time * 0.3);

  // 地形色阶
  vec3 color;
  if (n < 0.35) color = mix(vec3(0.0,0.1,0.4), vec3(0.0,0.3,0.7), n/0.35);
  else if (n < 0.5) color = mix(vec3(0.76,0.7,0.5), vec3(0.2,0.6,0.1), (n-0.35)/0.15);
  else if (n < 0.7) color = mix(vec3(0.2,0.6,0.1), vec3(0.35,0.25,0.1), (n-0.5)/0.2);
  else color = mix(vec3(0.35,0.25,0.1), vec3(1.0,1.0,1.0), (n-0.7)/0.3);

  gl_FragColor = vec4(color, 1.0);
}
