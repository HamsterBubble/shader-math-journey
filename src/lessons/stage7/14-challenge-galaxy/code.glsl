precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv=uv*2.0-1.0; uv.x*=u_resolution.x/u_resolution.y;
  // TODO: 用极坐标+对数螺旋画旋臂
  // TODO: 中心发光 + 星星粒子
  // TODO: 颜色：蓝紫核心 → 白色旋臂 → 星点
  vec3 color=vec3(0.01); gl_FragColor=vec4(color,1.0);
}
