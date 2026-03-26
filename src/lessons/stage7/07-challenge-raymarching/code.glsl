precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// TODO: 场景 SDF
// 提示:
// 球: length(p) - radius
// 地面: p.y + height
// 组合: min(球, 地面)
float sceneSDF(vec3 p) {
  return length(p) - 1.0; // 替换成你的场景
}

// TODO: 计算法线 (SDF 的梯度)
// 提示: 在 x,y,z 三个方向各偏移 epsilon 求差
vec3 calcNormal(vec3 p) {
  float e = 0.001;
  return normalize(vec3(
    sceneSDF(p + vec3(e,0,0)) - sceneSDF(p - vec3(e,0,0)),
    sceneSDF(p + vec3(0,e,0)) - sceneSDF(p - vec3(0,e,0)),
    sceneSDF(p + vec3(0,0,e)) - sceneSDF(p - vec3(0,0,e))
  ));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  // 相机
  vec3 ro = vec3(0.0, 1.0, -3.0); // ray origin
  vec3 rd = normalize(vec3(uv, 1.5)); // ray direction

  // TODO: Ray March 循环
  // 提示:
  // float t = 0.0;
  // for (int i = 0; i < 80; i++) {
  //   vec3 p = ro + rd * t;
  //   float d = sceneSDF(p);
  //   if (d < 0.001) break;
  //   t += d;
  //   if (t > 50.0) break;
  // }

  vec3 color = vec3(0.05, 0.08, 0.15); // 背景

  // 你的光照代码写在这里...

  gl_FragColor = vec4(color, 1.0);
}
