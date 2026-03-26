precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
float sdCircle(vec2 p,float r){return length(p)-r;}
float sdBox(vec2 p,vec2 s){vec2 d=abs(p)-s;return length(max(d,0.0))+min(max(d.x,d.y),0.0);}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv=uv*2.0-1.0; uv.x*=u_resolution.x/u_resolution.y;
  float t=sin(u_time*0.5)*0.5+0.5; // 0→1→0
  float circle=sdCircle(uv,0.4);
  float box=sdBox(uv,vec2(0.3));
  float d=mix(circle,box,t); // SDF 插值!
  float shape=smoothstep(0.01,-0.01,d);
  vec3 c1=vec3(0.3,0.7,1.0);
  vec3 c2=vec3(1.0,0.4,0.3);
  vec3 shapeColor=mix(c1,c2,t);
  vec3 color=mix(vec3(0.03),shapeColor,shape);
  color+=shapeColor*0.08*exp(-abs(d)*12.0);
  gl_FragColor=vec4(color,1.0);
}
