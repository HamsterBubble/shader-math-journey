precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
float sdRoundBox(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.0))+min(max(q.x,q.y),0.0)-r;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv=uv*2.0-1.0; uv.x*=u_resolution.x/u_resolution.y;
  float hover=sin(u_time*2.0)*0.5+0.5;
  // 按钮形状
  float btn=sdRoundBox(uv,vec2(0.4,0.15),0.08);
  // 阴影
  float shadow=sdRoundBox(uv-vec2(0.02,-0.02),vec2(0.4,0.15),0.08);
  float shadowMask=smoothstep(0.05,-0.05,shadow)*0.3;
  // 按钮填充
  float btnMask=smoothstep(0.005,-0.005,btn);
  // 渐变
  vec3 gradTop=mix(vec3(0.3,0.6,1.0),vec3(0.4,0.7,1.0),hover);
  vec3 gradBot=mix(vec3(0.15,0.35,0.8),vec3(0.2,0.45,0.9),hover);
  vec3 btnColor=mix(gradBot,gradTop,uv.y*2.0+0.5);
  // 边框
  float border=smoothstep(0.01,0.0,abs(btn)-0.005);
  vec3 borderColor=vec3(0.5,0.8,1.0);
  vec3 color=vec3(0.12);
  color=mix(color,vec3(0.0),shadowMask);
  color=mix(color,btnColor,btnMask);
  color=mix(color,borderColor,border*0.5);
  // 高光
  float highlight=smoothstep(0.0,0.1,uv.y)*btnMask*0.2;
  color+=vec3(1.0)*highlight;
  gl_FragColor=vec4(color,1.0);
}
