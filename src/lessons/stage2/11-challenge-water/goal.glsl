precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv=uv*2.0-1.0;uv.x*=u_resolution.x/u_resolution.y;
  float d1=length(uv-vec2(-0.3,0.2));
  float d2=length(uv-vec2(0.3,-0.1));
  float w1=sin(d1*25.0-u_time*4.0)*exp(-d1*2.0);
  float w2=sin(d2*20.0-u_time*3.5+1.5)*exp(-d2*2.5)*0.7;
  float wave=w1+w2;
  vec2 distort=uv+vec2(wave)*0.02;
  float bg=sin(distort.x*3.0+distort.y*2.0)*0.1+0.5;
  vec3 deep=vec3(0.0,0.1,0.3);
  vec3 shallow=vec3(0.1,0.4,0.6);
  vec3 color=mix(deep,shallow,bg);
  color+=vec3(0.4,0.6,0.8)*wave*0.3;
  float highlight=pow(max(wave,0.0),3.0)*0.8;
  color+=vec3(0.8,0.9,1.0)*highlight;
  gl_FragColor=vec4(color,1.0);
}
