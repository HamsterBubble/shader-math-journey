precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

mat2 rot(float a) { float c=cos(a),s=sin(a); return mat2(c,s,-s,c); }

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 域重复!
  float period = 0.5;
  vec2 id = floor((uv + period * 0.5) / period);
  vec2 q = mod(uv + period * 0.5, period) - period * 0.5;

  // 每个副本不同旋转
  float angle = u_time + (id.x * 3.0 + id.y * 7.0) * 0.5;
  q = rot(angle) * q;

  // 画方块
  vec2 d = abs(q) - vec2(0.1);
  float box = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  box -= 0.02; // 圆角

  float shape = smoothstep(0.008, -0.008, box);

  // 颜色 by ID
  float hue = (id.x + id.y) * 0.3 + u_time * 0.1;
  vec3 col = vec3(sin(hue*6.283)*0.5+0.5, sin(hue*6.283+2.094)*0.5+0.5, sin(hue*6.283+4.189)*0.5+0.5);

  float glow = exp(-abs(box) * 30.0) * 0.3;

  // 衰减 (越远越暗)
  float fade = exp(-length(uv) * 0.8);

  vec3 color = vec3(0.02);
  color = mix(color, col, shape * fade);
  color += col * glow * fade;

  gl_FragColor = vec4(color, 1.0);
}
