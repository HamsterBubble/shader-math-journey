precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
float scene(vec2 p){return sin(p.x*5.0+u_time)*sin(p.y*5.0)*0.5+0.5;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv.x*=u_resolution.x/u_resolution.y;
  float e=1.0/u_resolution.y;
  // Sobel 算子
  float tl=scene(uv+vec2(-e,e)); float t=scene(uv+vec2(0,e)); float tr=scene(uv+vec2(e,e));
  float l=scene(uv+vec2(-e,0)); float r=scene(uv+vec2(e,0));
  float bl=scene(uv+vec2(-e,-e)); float b=scene(uv+vec2(0,-e)); float br=scene(uv+vec2(e,-e));
  float gx=(-tl+tr-2.0*l+2.0*r-bl+br);
  float gy=(-tl-2.0*t-tr+bl+2.0*b+br);
  float edge=sqrt(gx*gx+gy*gy);
  vec3 color=vec3(edge*2.0);
  gl_FragColor=vec4(color,1.0);
}
