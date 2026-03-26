precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv.x*=u_resolution.x/u_resolution.y;
  // 六角网格
  vec2 s=vec2(1.0,1.732);
  vec2 p1=mod(uv,s)-s*0.5;
  vec2 p2=mod(uv-s*0.5,s)-s*0.5;
  float d1=length(p1);
  float d2=length(p2);
  float d=min(d1,d2);
  float hex=smoothstep(0.02,0.0,abs(d-0.4));
  vec3 color=vec3(0.05);
  color+=vec3(0.2,0.6,1.0)*hex;
  color+=vec3(0.1,0.3,0.6)*smoothstep(0.45,0.2,d)*0.3;
  gl_FragColor=vec4(color,1.0);
}
