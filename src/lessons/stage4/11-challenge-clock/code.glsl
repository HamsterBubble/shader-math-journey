precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv=uv*2.0-1.0; uv.x*=u_resolution.x/u_resolution.y;
  // TODO: 画钟盘（圆环）、12个刻度、指针
  vec3 color=vec3(0.95); gl_FragColor=vec4(color,1.0);
}
