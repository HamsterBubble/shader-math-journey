precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  // 原始颜色（模拟场景）
  float r=length(uv-0.5);
  vec3 scene=mix(vec3(0.2,0.5,0.8),vec3(0.9,0.6,0.2),uv.y);
  scene+=vec3(1.0,0.9,0.7)*smoothstep(0.2,0.0,r)*0.3;

  // 色彩分级
  // 1. 对比度
  float contrast=1.3;
  scene=(scene-0.5)*contrast+0.5;

  // 2. 色温 (暖色偏移)
  scene.r*=1.1;
  scene.b*=0.9;

  // 3. 暗角 (Vignette)
  float vignette=1.0-smoothstep(0.3,0.8,r);
  scene*=0.7+0.3*vignette;

  // 4. 色调映射 (简单 Reinhard)
  scene=scene/(1.0+scene);

  // 5. Gamma
  scene=pow(scene,vec3(1.0/2.2));

  gl_FragColor=vec4(scene,1.0);
}
