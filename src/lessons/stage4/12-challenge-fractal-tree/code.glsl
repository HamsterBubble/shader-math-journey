precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv.x=uv.x*2.0-1.0; uv.x*=u_resolution.x/u_resolution.y; uv.y=uv.y*2.0-0.2;
  // TODO: 画树干线段 → 分叉 → 递归旋转缩放
  vec3 color=vec3(0.05,0.15,0.1); gl_FragColor=vec4(color,1.0);
}
