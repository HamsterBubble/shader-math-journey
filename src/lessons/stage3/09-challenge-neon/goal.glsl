precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv=uv*2.0-1.0;uv.x*=u_resolution.x/u_resolution.y;
  float d1=abs(length(uv)-0.5)-0.005;
  float d2=abs(length(uv-vec2(0.0,0.15))-0.3)-0.005;
  float d3=abs(uv.y-sin(uv.x*3.0+u_time)*0.2)-0.005;
  float flicker1=sin(u_time*8.0)*0.1+0.9;
  float flicker2=sin(u_time*12.0+2.0)*0.08+0.92;
  vec3 color=vec3(0.01,0.01,0.02);
  color+=vec3(1.0,0.1,0.3)*exp(-d1*80.0)*0.8*flicker1;
  color+=vec3(0.1,0.5,1.0)*exp(-d2*80.0)*0.6*flicker2;
  color+=vec3(0.2,1.0,0.5)*exp(-d3*60.0)*0.5;
  color+=vec3(1.0,0.1,0.3)*exp(-d1*20.0)*0.15;
  color+=vec3(0.1,0.5,1.0)*exp(-d2*20.0)*0.1;
  color+=vec3(0.2,1.0,0.5)*exp(-d3*15.0)*0.08;
  gl_FragColor=vec4(color,1.0);
}
