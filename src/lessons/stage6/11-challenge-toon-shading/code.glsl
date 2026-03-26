precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv=uv*2.0-1.0; uv.x*=u_resolution.x/u_resolution.y;
  // TODO: 画带光照的球体，用 floor 量化光照为 2-3 个色阶
  vec3 color=vec3(0.1); gl_FragColor=vec4(color,1.0);
}
