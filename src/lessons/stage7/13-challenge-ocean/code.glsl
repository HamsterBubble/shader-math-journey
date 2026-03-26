precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv=uv*2.0-1.0; uv.x*=u_resolution.x/u_resolution.y;
  // TODO: 用多层 sin 波叠加做波浪高度场
  // TODO: 水面法线→菲涅尔反射
  // TODO: 颜色：深蓝(深处) → 青绿(浅处) → 白色(波峰泡沫)
  vec3 color=vec3(0.0,0.1,0.2); gl_FragColor=vec4(color,1.0);
}
