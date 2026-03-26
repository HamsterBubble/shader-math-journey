precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
float sdCircle(vec2 p,float r){return length(p)-r;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv=uv*2.0-1.0; uv.x*=u_resolution.x/u_resolution.y;
  float d=sdCircle(uv,0.5);
  float annular=abs(d)-0.05; // 环形
  float cut=uv.x-sin(u_time)*0.3; // 切割面
  float result=max(annular,-cut); // 半环
  float shape=smoothstep(0.01,-0.01,result);
  vec3 color=mix(vec3(0.03),vec3(0.9,0.4,0.3),shape);
  color+=vec3(0.9,0.4,0.3)*0.08*exp(-abs(result)*12.0);
  gl_FragColor=vec4(color,1.0);
}
