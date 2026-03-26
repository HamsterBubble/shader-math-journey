precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv.x*=u_resolution.x/u_resolution.y;
  // 热源
  vec2 p1=vec2(0.3+sin(u_time)*0.1,0.4);
  vec2 p2=vec2(0.7,0.6+cos(u_time*1.3)*0.1);
  vec2 p3=vec2(0.5+cos(u_time*0.7)*0.15,0.3);
  float heat=0.0;
  heat+=0.15/length(uv-p1);
  heat+=0.1/length(uv-p2);
  heat+=0.12/length(uv-p3);
  heat=clamp(heat,0.0,2.0);
  // 温度颜色映射
  vec3 cold=vec3(0.0,0.0,0.3);
  vec3 mid=vec3(1.0,0.3,0.0);
  vec3 hot=vec3(1.0,1.0,0.3);
  vec3 color=mix(cold,mid,smoothstep(0.0,1.0,heat));
  color=mix(color,hot,smoothstep(1.0,2.0,heat));
  gl_FragColor=vec4(color,1.0);
}
