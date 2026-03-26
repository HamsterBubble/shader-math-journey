precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.0;a*=0.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv=uv*2.0-1.0; uv.x*=u_resolution.x/u_resolution.y;
  // 透视倾斜
  vec2 ocean=uv*vec2(3.0,1.0)+vec2(u_time*0.2,0.0);
  float height=0.0;
  height+=sin(ocean.x*2.0+u_time*1.5)*0.15;
  height+=sin(ocean.x*4.5-u_time*1.0+ocean.y*2.0)*0.08;
  height+=fbm(ocean*3.0+u_time*0.3)*0.1;
  // 水面颜色
  float depth=uv.y+height;
  vec3 deepColor=vec3(0.0,0.05,0.15);
  vec3 shallowColor=vec3(0.0,0.3,0.5);
  vec3 foamColor=vec3(0.8,0.9,1.0);
  vec3 color=mix(deepColor,shallowColor,smoothstep(-0.5,0.2,depth));
  // 波峰泡沫
  float foam=smoothstep(0.12,0.15,height);
  color=mix(color,foamColor,foam*0.7);
  // 高光
  float spec=pow(max(height*3.0,0.0),5.0)*0.5;
  color+=vec3(1.0,0.95,0.9)*spec;
  // 天空
  float sky=smoothstep(-0.1,0.0,uv.y+height*0.3);
  vec3 skyColor=mix(vec3(0.8,0.5,0.3),vec3(0.15,0.2,0.5),uv.y+0.5);
  color=mix(color,skyColor,1.0-sky);
  gl_FragColor=vec4(color,1.0);
}
