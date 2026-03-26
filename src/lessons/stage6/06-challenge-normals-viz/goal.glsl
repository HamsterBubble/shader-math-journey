precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
float scene(vec2 p){
  float c1=length(p-vec2(0.2,0.0))-0.4;
  float c2=length(p-vec2(-0.2,0.0))-0.35;
  float box=max(abs(p.x+0.0)-0.1,abs(p.y-0.4)-0.15);
  return min(min(c1,c2),box);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv=uv*2.0-1.0;uv.x*=u_resolution.x/u_resolution.y;
  float d=scene(uv);
  float e=0.001;
  vec2 n=normalize(vec2(scene(uv+vec2(e,0))-scene(uv-vec2(e,0)),scene(uv+vec2(0,e))-scene(uv-vec2(0,e))));
  float shape=smoothstep(0.01,-0.01,d);
  vec3 normalColor=vec3(n*0.5+0.5,0.5);
  float edge=smoothstep(0.02,0.0,abs(d));
  vec3 distViz=mix(vec3(0.1,0.05,0.2),vec3(0.05,0.2,0.4),sin(d*60.0-u_time*3.0)*0.5+0.5);
  vec3 color=mix(distViz,normalColor,shape);
  color=mix(color,vec3(1.0),edge*0.6);
  gl_FragColor=vec4(color,1.0);
}
