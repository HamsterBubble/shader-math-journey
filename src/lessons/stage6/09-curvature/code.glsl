precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
float scene(vec2 p){return sin(p.x*4.0+u_time)*cos(p.y*3.0)*0.5+0.5;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv.x*=u_resolution.x/u_resolution.y;
  float e=2.0/u_resolution.y;
  // 二阶导数近似
  float cx=scene(uv); float lx=scene(uv-vec2(e,0.)); float rx=scene(uv+vec2(e,0.));
  float ly=scene(uv-vec2(0.,e)); float ry=scene(uv+vec2(0.,e));
  float ddx=(lx-2.0*cx+rx)/(e*e);
  float ddy=(ly-2.0*cx+ry)/(e*e);
  float curvature=ddx+ddy; // 拉普拉斯 ≈ 曲率
  vec3 color=mix(vec3(0.2,0.5,1.0),vec3(1.0,0.3,0.2),curvature*0.001+0.5);
  gl_FragColor=vec4(color,1.0);
}
