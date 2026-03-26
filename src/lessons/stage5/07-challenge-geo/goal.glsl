precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
float sdCircle(vec2 p,float r){return length(p)-r;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;uv=uv*2.0-1.0;
  uv.x*=u_resolution.x/u_resolution.y;
  float face=sdCircle(uv,0.6);
  float eyeL=sdCircle(uv-vec2(-0.2,0.15),0.08);
  float eyeR=sdCircle(uv-vec2(0.2,0.15),0.08);
  float mouth=max(sdCircle(uv-vec2(0.0,-0.1),0.3),-uv.y-0.1);
  float shape=smoothstep(0.01,-0.01,face);
  float eyes=smoothstep(0.01,-0.01,min(eyeL,eyeR));
  float smile=smoothstep(0.02,0.0,abs(mouth)-0.02);
  vec3 color=vec3(0.03);
  color=mix(color,vec3(1.0,0.85,0.3),shape);
  color=mix(color,vec3(0.15,0.1,0.05),eyes);
  color=mix(color,vec3(0.6,0.2,0.1),smile*shape);
  color+=vec3(1.0,0.85,0.3)*0.08*exp(-abs(face)*10.0);
  gl_FragColor=vec4(color,1.0);
}
