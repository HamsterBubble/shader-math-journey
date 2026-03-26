precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv.x=(uv.x*2.0-1.0)*(u_resolution.x/u_resolution.y);
  uv.y=uv.y*2.0-0.2;
  float tree=0.0;
  float angle=0.5+sin(u_time*0.5)*0.15;
  vec2 p=uv*3.0;
  float w=0.04;
  // trunk
  tree+=smoothstep(w,0.0,abs(p.x))*step(0.0,p.y)*step(p.y,1.0);
  p.y-=1.0;
  for(float i=0.0;i<5.0;i++){
    p=abs(p.x)>0.001?vec2(abs(p.x),p.y):p;
    p=rot(angle)*p;
    p*=1.0/0.7;
    w*=0.85;
    tree+=smoothstep(w,0.0,abs(p.x))*step(0.0,p.y)*step(p.y,1.0)*pow(0.7,i);
    p.y-=1.0;
  }
  tree=clamp(tree,0.0,1.0);
  vec3 brown=vec3(0.45,0.28,0.12);
  vec3 green=vec3(0.15,0.4,0.1);
  vec3 color=mix(vec3(0.05,0.12,0.08), mix(brown,green,smoothstep(2.0,5.0,uv.y*3.0+3.0)), tree);
  gl_FragColor=vec4(color,1.0);
}
