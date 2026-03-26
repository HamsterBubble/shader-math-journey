precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
float hash21(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
float star(vec2 uv,vec2 id,float t){
  vec2 o=vec2(hash21(id),hash21(id+73.0))-0.5;
  float d=length(uv-o);
  float brightness=hash21(id+42.0);
  float twinkle=sin(t*3.0+brightness*6.283)*0.3+0.7;
  float s=0.02+0.02*brightness;
  return smoothstep(s,0.0,d)*twinkle*brightness;
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv=uv*2.0-1.0;uv.x*=u_resolution.x/u_resolution.y;
  vec3 color=vec3(0.0,0.0,0.02);
  for(int i=0;i<4;i++){
    float layer=float(i);
    float speed=1.0+layer*0.5;
    float scale=10.0+layer*5.0;
    vec2 st=uv*scale+vec2(0.0,u_time*speed);
    vec2 id=floor(st);
    vec2 gv=fract(st)-0.5;
    float s=star(gv,id,u_time);
    vec3 sc=mix(vec3(0.6,0.7,1.0),vec3(1.0,0.9,0.7),hash21(id+99.0));
    color+=sc*s*(0.5+0.5/float(i+1));
  }
  float vignette=1.0-length(uv)*0.4;
  color*=vignette;
  gl_FragColor=vec4(color,1.0);
}
