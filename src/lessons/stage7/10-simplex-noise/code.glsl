precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// Simplex-like noise using gradient approach
vec2 hash2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}

float simplex2d(vec2 p){
  const float K1=0.366025404; // (sqrt(3)-1)/2
  const float K2=0.211324865; // (3-sqrt(3))/6
  vec2 i=floor(p+(p.x+p.y)*K1);
  vec2 a=p-i+(i.x+i.y)*K2;
  vec2 o=step(a.yx,a.xy);
  vec2 b=a-o+K2;
  vec2 c=a-1.0+2.0*K2;
  vec3 h=max(0.5-vec3(dot(a,a),dot(b,b),dot(c,c)),0.0);
  h=h*h*h*h;
  vec2 ga=hash2(i)*2.0-1.0;
  vec2 gb=hash2(i+o)*2.0-1.0;
  vec2 gc=hash2(i+1.0)*2.0-1.0;
  return dot(h,vec3(dot(a,ga),dot(b,gb),dot(c,gc)))*70.0*0.5+0.5;
}

void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv.x*=u_resolution.x/u_resolution.y;
  float n=simplex2d(uv*6.0+u_time*0.3);
  vec3 color=vec3(n);
  gl_FragColor=vec4(color,1.0);
}
