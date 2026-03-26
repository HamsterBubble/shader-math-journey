precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
float scene(vec2 p){return length(p-vec2(0.5))-0.3+sin(p.x*20.0+u_time)*0.02;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv.x*=u_resolution.x/u_resolution.y;
  float e=1.0/u_resolution.y;
  float c=scene(uv);
  float l=scene(uv-vec2(e,0.)); float r=scene(uv+vec2(e,0.));
  float d=scene(uv-vec2(0.,e)); float u2=scene(uv+vec2(0.,e));
  float laplacian=(l+r+d+u2-4.0*c)/(e*e);
  float nl=laplacian*0.0005;
  vec3 color=mix(vec3(0.1,0.2,0.8),vec3(1.0,0.2,0.1),nl+0.5);
  float edge=smoothstep(0.01,-0.01,c);
  color=mix(color,vec3(1.0),edge*0.2);
  gl_FragColor=vec4(color,1.0);
}
