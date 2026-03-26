precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

mat2 rot(float a) { float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float angle = u_time * 0.5;
  mat2 fwd = rot(angle) * mat2(1.5,0.,0.,0.8);
  mat2 inv = mat2(1.0/1.5,0.,0.,1.0/0.8) * rot(-angle);

  vec2 uvA = fwd * uv;
  vec2 uvB = inv * uvA; // 还原

  float d1 = length(uvA) - 0.3;
  float d2 = length(uvB) - 0.3;

  vec3 color = vec3(0.05);
  color += vec3(0.3,0.6,1.0) * smoothstep(0.01,-0.01, d1) * 0.5;
  color += vec3(1.0,0.5,0.2) * smoothstep(0.01,-0.01, d2);

  gl_FragColor = vec4(color, 1.0);
}
