precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p);vec2 f=fract(p);
  f=f*f*(3.0-2.0*f);
  float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));
  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv=uv*2.0-1.0;uv.x*=u_resolution.x/u_resolution.y;
  vec2 fire_uv=uv;
  fire_uv.y+=0.7;
  float shape=1.0-smoothstep(0.0,1.8,fire_uv.y);
  shape*=1.0-smoothstep(0.0,0.5,abs(fire_uv.x)*(0.8+fire_uv.y*0.8));
  float n=noise(vec2(fire_uv.x*4.0,fire_uv.y*3.0-u_time*3.0));
  n+=noise(vec2(fire_uv.x*8.0,fire_uv.y*6.0-u_time*4.0))*0.5;
  float flame=shape*(n*0.7+0.3);
  flame=smoothstep(0.1,0.9,flame);
  vec3 color=vec3(0.01);
  color=mix(color,vec3(0.8,0.1,0.0),smoothstep(0.0,0.3,flame));
  color=mix(color,vec3(1.0,0.5,0.0),smoothstep(0.3,0.6,flame));
  color=mix(color,vec3(1.0,0.9,0.4),smoothstep(0.6,0.85,flame));
  color=mix(color,vec3(1.0),smoothstep(0.85,1.0,flame));
  color+=vec3(1.0,0.3,0.05)*shape*0.1;
  gl_FragColor=vec4(color,1.0);
}
