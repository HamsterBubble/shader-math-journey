precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy; uv=uv*2.0-1.0; uv.x*=u_resolution.x/u_resolution.y;
  float face=length(uv)-0.6;
  float faceShape=smoothstep(0.01,-0.01,face);
  float eyeL=length(uv-vec2(-0.2,0.15))-0.08;
  float eyeR=length(uv-vec2(0.2,0.15))-0.08;
  float eyes=min(eyeL,eyeR);
  float eyeShape=smoothstep(0.01,-0.01,eyes);
  // 嘴巴：半环
  float mouth=length(uv-vec2(0.0,-0.1))-0.25;
  float mouthRing=abs(mouth)-0.03;
  float mouthCut=max(mouthRing,uv.y+0.1);
  float mouthShape=smoothstep(0.01,-0.01,mouthCut);
  // 腮红
  float blushL=smoothstep(0.12,0.05,length(uv-vec2(-0.35,-0.05)));
  float blushR=smoothstep(0.12,0.05,length(uv-vec2(0.35,-0.05)));
  vec3 color=vec3(0.05);
  color=mix(color,vec3(1.0,0.85,0.3),faceShape);
  color+=vec3(1.0,0.4,0.4)*(blushL+blushR)*0.4*faceShape;
  color=mix(color,vec3(0.15),eyeShape);
  color=mix(color,vec3(0.15),mouthShape*faceShape);
  color+=vec3(1.0,0.85,0.3)*0.1*exp(-abs(face)*8.0);
  gl_FragColor=vec4(color,1.0);
}
