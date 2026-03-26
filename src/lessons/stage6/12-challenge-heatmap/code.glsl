precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv.x*=u_resolution.x/u_resolution.y;
  // TODO: 创建几个热源点，计算距离场，映射为温度颜色
  vec3 color=vec3(0.05); gl_FragColor=vec4(color,1.0);
}
