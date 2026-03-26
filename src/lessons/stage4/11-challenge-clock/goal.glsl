precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv=uv*2.0-1.0; uv.x*=u_resolution.x/u_resolution.y;
  float r=length(uv);
  float ring=smoothstep(0.02,0.0,abs(r-0.8));
  float ticks=0.0;
  for(float i=0.0;i<12.0;i++){
    vec2 tp=rot(i*3.14159/6.0)*vec2(0.0,0.7);
    ticks+=smoothstep(0.03,0.01,length(uv-tp));
  }
  float sec_a=-u_time*6.2832/60.0+1.5708;
  float min_a=-u_time*6.2832/3600.0+1.5708;
  float hr_a=-u_time*6.2832/43200.0+1.5708;
  vec2 suv=rot(sec_a)*uv, muv=rot(min_a)*uv, huv=rot(hr_a)*uv;
  float secH=smoothstep(0.005,0.0,abs(suv.x))*step(0.0,suv.y)*step(suv.y,0.65);
  float minH=smoothstep(0.012,0.0,abs(muv.x))*step(0.0,muv.y)*step(muv.y,0.55);
  float hrH=smoothstep(0.018,0.0,abs(huv.x))*step(0.0,huv.y)*step(huv.y,0.4);
  vec3 color=vec3(0.95,0.93,0.9);
  color=mix(color,vec3(0.2),ring); color=mix(color,vec3(0.3),ticks);
  color=mix(color,vec3(0.1),hrH); color=mix(color,vec3(0.1),minH);
  color=mix(color,vec3(0.8,0.1,0.1),secH);
  color=mix(color,vec3(0.3),smoothstep(0.04,0.02,r));
  gl_FragColor=vec4(color,1.0);
}
