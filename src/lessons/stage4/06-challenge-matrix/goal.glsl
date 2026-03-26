precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,s,-s,c);}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;uv=uv*2.0-1.0;
  uv.x*=u_resolution.x/u_resolution.y;
  uv=rot(u_time*0.1)*uv;
  for(int i=0;i<6;i++){uv=rot(3.14159/6.0)*uv;uv=abs(uv);}
  float d=abs(uv.y-sin(uv.x*5.0+u_time)*0.15)-0.02;
  float line=smoothstep(0.01,0.0,d);
  float d2=length(uv)-0.3;float circle=smoothstep(0.01,0.0,abs(d2)-0.01);
  float hue=atan(uv.y,uv.x)/6.283+0.5;
  vec3 col=vec3(sin(hue*6.283)*0.5+0.5,sin(hue*6.283+2.094)*0.5+0.5,sin(hue*6.283+4.189)*0.5+0.5);
  vec3 color=vec3(0.03);color+=col*line;color+=col*circle*0.5;
  color+=col*0.05*exp(-length(uv)*3.0);
  gl_FragColor=vec4(color,1.0);
}
