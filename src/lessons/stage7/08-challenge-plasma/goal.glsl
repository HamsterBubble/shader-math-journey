precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv=uv*2.0-1.0;uv.x*=u_resolution.x/u_resolution.y;
  float v=sin(uv.x*10.0+u_time);
  v+=sin(uv.y*8.0-u_time*0.7);
  v+=sin((uv.x+uv.y)*6.0+u_time*0.5);
  v+=sin(length(uv)*12.0-u_time*1.5);
  v*=0.25;
  vec3 color=vec3(
    sin(v*3.14159*2.0)*0.5+0.5,
    sin(v*3.14159*2.0+2.094)*0.5+0.5,
    sin(v*3.14159*2.0+4.189)*0.5+0.5
  );
  color=pow(color,vec3(0.8));
  gl_FragColor=vec4(color,1.0);
}
