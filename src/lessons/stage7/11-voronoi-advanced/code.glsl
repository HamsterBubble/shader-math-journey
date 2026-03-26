precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
vec2 hash2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}

void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv.x*=u_resolution.x/u_resolution.y;
  vec2 p=uv*5.0;
  vec2 ip=floor(p);
  float f1=1e9, f2=1e9;
  vec2 closest;
  for(float y=-1.0;y<=1.0;y++)
  for(float x=-1.0;x<=1.0;x++){
    vec2 nb=vec2(x,y);
    vec2 pt=hash2(ip+nb)+nb;
    float d=length(p-ip-pt);
    if(d<f1){f2=f1;f1=d;closest=pt+ip+nb;}
    else if(d<f2){f2=d;}
  }
  // F2-F1 → 细胞边界
  float edge=f2-f1;
  // F1 → 细胞着色
  vec3 cellColor=vec3(hash2(floor(closest)).x,hash2(floor(closest)*1.3).x,0.8);
  vec3 color=cellColor*smoothstep(0.0,0.15,edge);
  // 动画：移动点
  // (此处用静态演示基础)
  gl_FragColor=vec4(color,1.0);
}
