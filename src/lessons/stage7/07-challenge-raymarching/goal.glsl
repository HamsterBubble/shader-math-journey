precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
float sceneSDF(vec3 p){
  float sphere=length(p-vec3(0,0.5,0))-0.8;
  float ground=p.y+0.5;
  return min(sphere,ground);
}
vec3 calcNormal(vec3 p){
  float e=0.001;
  return normalize(vec3(
    sceneSDF(p+vec3(e,0,0))-sceneSDF(p-vec3(e,0,0)),
    sceneSDF(p+vec3(0,e,0))-sceneSDF(p-vec3(0,e,0)),
    sceneSDF(p+vec3(0,0,e))-sceneSDF(p-vec3(0,0,e))));
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;uv=uv*2.0-1.0;
  uv.x*=u_resolution.x/u_resolution.y;
  vec3 ro=vec3(0.0,1.0,-3.0);vec3 rd=normalize(vec3(uv,1.5));
  float t=0.0;
  for(int i=0;i<80;i++){vec3 p=ro+rd*t;float d=sceneSDF(p);if(d<0.001)break;t+=d;if(t>50.0)break;}
  vec3 color=mix(vec3(0.1,0.15,0.3),vec3(0.02,0.05,0.1),uv.y*0.5+0.5);
  if(t<50.0){
    vec3 p=ro+rd*t;vec3 N=calcNormal(p);
    vec3 L=normalize(vec3(cos(u_time*0.5),1.0,sin(u_time*0.5)));
    float diff=max(dot(N,L),0.0);
    vec3 R=reflect(-L,N);float spec=pow(max(dot(R,-rd),0.0),16.0);
    vec3 mat=p.y>-0.49?vec3(0.8,0.2,0.3):vec3(0.3+0.3*mod(floor(p.x*2.0)+floor(p.z*2.0),2.0));
    color=mat*(0.1+0.8*diff)+vec3(1.0)*spec*0.4;
  }
  gl_FragColor=vec4(color,1.0);
}
