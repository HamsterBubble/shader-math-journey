precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv=uv*2.0-1.0;uv.x*=u_resolution.x/u_resolution.y;
  vec2 p1=vec2(cos(u_time*1.1),sin(u_time*0.9))*0.5;
  vec2 p2=vec2(cos(u_time*0.7+2.0),sin(u_time*1.3+1.0))*0.5;
  vec2 p3=vec2(cos(u_time*1.5+4.0),sin(u_time*0.6+3.0))*0.4;
  float e=0.15/length(uv-p1)+0.12/length(uv-p2)+0.1/length(uv-p3);
  float shape=smoothstep(0.95,1.05,e);
  float hue=e*0.3+u_time*0.1;
  vec3 col=vec3(sin(hue*6.283)*0.5+0.5,sin(hue*6.283+2.094)*0.5+0.5,sin(hue*6.283+4.189)*0.5+0.5);
  vec3 color=vec3(0.03);
  color=mix(color,col,shape);
  color+=col*0.15*smoothstep(0.5,1.0,e)*(1.0-shape);
  gl_FragColor=vec4(color,1.0);
}
