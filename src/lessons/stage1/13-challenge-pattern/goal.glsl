precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;
  float gridSize = 4.0;
  vec2 cellID = floor(uv * gridSize);
  vec2 cellUV = fract(uv * gridSize);
  float phase = cellID.x * 0.7 + cellID.y * 1.3;
  float pulse = sin(u_time * 2.0 + phase) * 0.5 + 0.5;
  float d = length(cellUV - 0.5);
  float ringR = 0.15 + 0.1 * pulse;
  float ring = smoothstep(0.02, 0.0, abs(d - ringR) - 0.02);
  float dot = smoothstep(0.06, 0.04, d);
  vec3 ringCol = mix(vec3(0.2,0.5,1.0), vec3(1.0,0.3,0.5), sin(phase)*0.5+0.5);
  vec3 color = vec3(0.03, 0.03, 0.06);
  color = mix(color, ringCol, ring);
  color = mix(color, vec3(1.0), dot);
  color += ringCol * 0.08 * exp(-d * 6.0);
  gl_FragColor = vec4(color, 1.0);
}
