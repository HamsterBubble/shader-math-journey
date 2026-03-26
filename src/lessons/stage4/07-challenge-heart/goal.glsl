precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv=uv*2.0-1.0;uv.x*=u_resolution.x/u_resolution.y;
  float beat=1.0+0.08*pow(sin(u_time*3.14159*2.0)*0.5+0.5,4.0);
  uv/=beat;uv.y-=0.1;
  float x=uv.x,y=uv.y;
  float a=x*x+y*y-0.3;
  float heart=a*a*a-x*x*y*y*y;
  float shape=smoothstep(0.01,-0.01,heart);
  vec3 col=mix(vec3(0.8,0.1,0.2),vec3(1.0,0.3,0.4),uv.y*0.5+0.5);
  float glow=exp(-abs(heart)*50.0)*0.6;
  vec3 color=vec3(0.03);
  color=mix(color,col,shape);
  color+=vec3(1.0,0.2,0.3)*glow*beat;
  gl_FragColor=vec4(color,1.0);
}
