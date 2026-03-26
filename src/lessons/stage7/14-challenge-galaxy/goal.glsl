precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv=uv*2.0-1.0; uv.x*=u_resolution.x/u_resolution.y;
  float r=length(uv);
  float theta=atan(uv.y,uv.x);
  // 旋臂：对数螺旋
  float arms=2.0;
  float spiral=theta-log(r+0.01)*3.0+u_time*0.2;
  float arm=pow(abs(sin(spiral*arms*0.5)),4.0);
  // 亮度随半径衰减
  float brightness=arm*exp(-r*1.5)*smoothstep(0.0,0.1,r);
  // 核心光
  float core=exp(-r*8.0)*0.8;
  // 星星
  vec2 starUV=uv*30.0;
  float star=step(0.97,hash(floor(starUV)))*smoothstep(0.5,0.45,fract(length(fract(starUV)-0.5)));
  star*=exp(-r*0.5);
  // 颜色
  vec3 armColor=mix(vec3(0.5,0.6,1.0),vec3(1.0,0.8,0.6),noise(uv*5.0));
  vec3 coreColor=vec3(0.9,0.8,1.0);
  vec3 color=vec3(0.01,0.005,0.02);
  color+=armColor*brightness;
  color+=coreColor*core;
  color+=vec3(0.9,0.95,1.0)*star*0.5;
  // 暗角
  color*=smoothstep(1.5,0.3,r);
  gl_FragColor=vec4(color,1.0);
}
