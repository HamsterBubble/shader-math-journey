precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv=uv*2.0-1.0; uv.x*=u_resolution.x/u_resolution.y;
  // TODO: 用 SDF 组合画一个 emoji 表情
  // 脸 = 大圆, 眼睛 = 两个小圆, 嘴巴 = 半环
  vec3 color=vec3(0.05); gl_FragColor=vec4(color,1.0);
}
