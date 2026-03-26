precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv=uv*2.0-1.0; uv.x*=u_resolution.x/u_resolution.y;
  float r=length(uv);
  float sphere=smoothstep(0.61,0.59,r);
  vec2 lightDir=normalize(vec2(cos(u_time),sin(u_time)));
  vec2 normal=normalize(uv);
  float diffuse=max(dot(normal,lightDir),0.0);
  // 量化为色阶
  float bands=3.0;
  float toon=floor(diffuse*bands)/bands;
  vec3 baseColor=vec3(0.9,0.3,0.4);
  vec3 litColor=baseColor*(0.2+0.8*toon);
  // 描边
  float outline=smoothstep(0.59,0.57,r)-smoothstep(0.61,0.59,r);
  vec3 color=vec3(0.95);
  color=mix(color,litColor,sphere);
  color=mix(color,vec3(0.1),outline);
  // 高光阶梯
  float spec=pow(max(dot(normal,lightDir),0.0),20.0);
  float specToon=step(0.5,spec);
  color+=vec3(1.0)*specToon*sphere*0.4;
  gl_FragColor=vec4(color,1.0);
}
