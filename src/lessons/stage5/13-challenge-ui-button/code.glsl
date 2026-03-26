precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv=uv*2.0-1.0; uv.x*=u_resolution.x/u_resolution.y;
  // TODO: 画一个圆角矩形按钮
  // TODO: 加渐变填充 + 边框 + 阴影
  // TODO: hover 效果（用 u_time 模拟）
  vec3 color=vec3(0.12); gl_FragColor=vec4(color,1.0);
}
