/**
 * GLSL built-in function & variable documentation for Monaco hover.
 * Each entry maps a symbol name → { signature, description }.
 */
export const glslDocs = {
  // ─── Built-in Variables ─────────────────────────────────
  gl_FragCoord: {
    signature: 'mediump vec4 gl_FragCoord',
    description:
      '当前片元的窗口坐标 `(x, y, z, 1/w)`。\n\n' +
      '- `gl_FragCoord.xy` 是像素坐标（左下角为原点）\n' +
      '- `gl_FragCoord.z` 是深度值 `[0, 1]`\n' +
      '- 常用技巧：`gl_FragCoord.xy / u_resolution` 得到归一化 UV',
  },
  gl_FragColor: {
    signature: 'mediump vec4 gl_FragColor',
    description:
      '片元着色器的输出颜色 `(r, g, b, a)`，各分量范围 `[0, 1]`。\n\n' +
      '> ⚠️ 在 GLSL ES 3.0+ 中已弃用，推荐使用 `out vec4` 变量。',
  },
  gl_Position: {
    signature: 'highp vec4 gl_Position',
    description:
      '顶点着色器的输出位置，是裁剪空间坐标 `(x, y, z, w)`。\n\n' +
      'GPU 会自动进行透视除法 `(x/w, y/w, z/w)` 得到 NDC 坐标。',
  },
  gl_PointSize: {
    signature: 'mediump float gl_PointSize',
    description:
      '设置 `GL_POINTS` 模式下点的渲染大小（像素）。\n\n' +
      '仅在顶点着色器中有效。',
  },

  // ─── 角度 & 三角函数 ────────────────────────────────────
  radians: {
    signature: 'float radians(float degrees)\nvec2  radians(vec2  degrees)\nvec3  radians(vec3  degrees)',
    description:
      '将**角度**转换为**弧度**。\n\n' +
      '公式：`result = degrees × π / 180`\n\n' +
      '```glsl\nfloat r = radians(90.0); // → π/2 ≈ 1.5708\n```',
  },
  degrees: {
    signature: 'float degrees(float radians)\nvec2  degrees(vec2  radians)\nvec3  degrees(vec3  radians)',
    description:
      '将**弧度**转换为**角度**。\n\n' +
      '公式：`result = radians × 180 / π`\n\n' +
      '```glsl\nfloat d = degrees(3.14159); // → ≈ 180.0\n```',
  },
  sin: {
    signature: 'float sin(float angle)\nvec2  sin(vec2  angle)\nvec3  sin(vec3  angle)',
    description:
      '返回角度（弧度）的**正弦值**，结果范围 `[-1, 1]`。\n\n' +
      '```glsl\nfloat y = sin(uv.x * 6.2832); // 一个完整正弦波\n```\n\n' +
      '💡 常用于波形动画、周期运动',
  },
  cos: {
    signature: 'float cos(float angle)\nvec2  cos(vec2  angle)\nvec3  cos(vec3  angle)',
    description:
      '返回角度（弧度）的**余弦值**，结果范围 `[-1, 1]`。\n\n' +
      '```glsl\nvec2 p = vec2(cos(t), sin(t)); // 单位圆上的点\n```\n\n' +
      '💡 与 `sin` 配合生成圆形运动轨迹',
  },
  tan: {
    signature: 'float tan(float angle)\nvec2  tan(vec2  angle)',
    description:
      '返回角度（弧度）的**正切值** `sin(angle)/cos(angle)`。\n\n' +
      '> ⚠️ 在 `π/2 + nπ` 处趋向无穷大，产生不连续',
  },
  asin: {
    signature: 'float asin(float x)\nvec2  asin(vec2  x)',
    description:
      '**反正弦**，输入范围 `[-1, 1]`，返回 `[-π/2, π/2]`。\n\n' +
      '输入超出范围时结果未定义。',
  },
  acos: {
    signature: 'float acos(float x)\nvec2  acos(vec2  x)',
    description:
      '**反余弦**，输入范围 `[-1, 1]`，返回 `[0, π]`。\n\n' +
      '输入超出范围时结果未定义。',
  },
  atan: {
    signature: 'float atan(float y, float x)\nfloat atan(float y_over_x)',
    description:
      '**反正切**，有两种形式：\n\n' +
      '- `atan(y, x)` — 完整的四象限反正切，返回 `[-π, π]`，等价于 C 的 `atan2`\n' +
      '- `atan(y_over_x)` — 单参数形式，返回 `[-π/2, π/2]`\n\n' +
      '```glsl\nfloat angle = atan(uv.y, uv.x); // 极坐标角度\n```\n\n' +
      '💡 生成极坐标图案的核心函数',
  },

  // ─── 指数函数 ──────────────────────────────────────────
  pow: {
    signature: 'float pow(float x, float y)\nvec2  pow(vec2  x, vec2  y)\nvec3  pow(vec3  x, vec3  y)',
    description:
      '返回 `x` 的 `y` 次方：`x^y`。\n\n' +
      '> ⚠️ 当 `x < 0` 时结果未定义；`x = 0` 且 `y ≤ 0` 时也未定义\n\n' +
      '```glsl\nfloat gamma = pow(color, vec3(1.0/2.2)); // Gamma 校正\n```\n\n' +
      '💡 常用于 Gamma 校正、对比度调节、衰减曲线',
  },
  exp: {
    signature: 'float exp(float x)\nvec2  exp(vec2  x)',
    description:
      '返回**自然指数** `e^x`（e ≈ 2.71828）。\n\n' +
      '```glsl\nfloat falloff = exp(-distance * 2.0); // 指数衰减\n```\n\n' +
      '💡 常用于光照衰减、雾效果',
  },
  log: {
    signature: 'float log(float x)\nvec2  log(vec2  x)',
    description:
      '返回**自然对数** `ln(x)`，是 `exp` 的逆运算。\n\n' +
      '> ⚠️ `x` 必须大于 0',
  },
  exp2: {
    signature: 'float exp2(float x)\nvec2  exp2(vec2  x)',
    description:
      '返回 `2^x`。比 `pow(2.0, x)` 更快更精确。\n\n' +
      '💡 在 MIP 级别计算等场景中常用',
  },
  log2: {
    signature: 'float log2(float x)\nvec2  log2(vec2  x)',
    description:
      '返回以 2 为底的对数 `log₂(x)`，是 `exp2` 的逆运算。\n\n' +
      '> ⚠️ `x` 必须大于 0',
  },
  sqrt: {
    signature: 'float sqrt(float x)\nvec2  sqrt(vec2  x)',
    description:
      '返回**平方根** `√x`。\n\n' +
      '> ⚠️ `x` 必须 ≥ 0\n\n' +
      '```glsl\nfloat d = sqrt(dot(p, p)); // 等价于 length(p)，但 length 更推荐\n```',
  },
  inversesqrt: {
    signature: 'float inversesqrt(float x)\nvec2  inversesqrt(vec2  x)',
    description:
      '返回 `1 / √x`，即平方根的倒数。\n\n' +
      '比 `1.0 / sqrt(x)` 更快（GPU 有专用指令）。\n\n' +
      '💡 常用于手动归一化向量',
  },

  // ─── 通用数学函数 ──────────────────────────────────────
  abs: {
    signature: 'float abs(float x)\nvec2  abs(vec2  x)\nvec3  abs(vec3  x)',
    description:
      '返回**绝对值** `|x|`。\n\n' +
      '```glsl\nfloat d = abs(uv.x - 0.5); // 到中心线的距离\n```\n\n' +
      '💡 常用于对称图案、SDF 中的镜像操作',
  },
  sign: {
    signature: 'float sign(float x)\nvec2  sign(vec2  x)',
    description:
      '返回 `x` 的**符号**：\n' +
      '- `x > 0` → `1.0`\n' +
      '- `x = 0` → `0.0`\n' +
      '- `x < 0` → `-1.0`\n\n' +
      '💡 SDF 中用于判断内外：`sign(sdf)` 内部为负，外部为正',
  },
  floor: {
    signature: 'float floor(float x)\nvec2  floor(vec2  x)',
    description:
      '返回 ≤ x 的最大整数（**向下取整**）。\n\n' +
      '```glsl\nvec2 cell = floor(uv * 5.0); // 5×5 网格的格子坐标\n```\n\n' +
      '💡 核心用途：创建网格、棋盘格、格子噪声',
  },
  ceil: {
    signature: 'float ceil(float x)\nvec2  ceil(vec2  x)',
    description:
      '返回 ≥ x 的最小整数（**向上取整**）。\n\n' +
      '```glsl\nfloat n = ceil(3.2); // → 4.0\n```',
  },
  fract: {
    signature: 'float fract(float x)\nvec2  fract(vec2  x)',
    description:
      '返回**小数部分** `x - floor(x)`，结果范围 `[0, 1)`。\n\n' +
      '```glsl\nvec2 f = fract(uv * 5.0); // 每个格子内的局部坐标\n```\n\n' +
      '💡 核心用途之一！与 `floor` 配合实现平铺、重复图案\n\n' +
      '经典组合：\n' +
      '```glsl\nvec2 cell = floor(uv * N); // 格子 ID\nvec2 f    = fract(uv * N); // 格子内坐标 [0,1)\n```',
  },
  mod: {
    signature: 'float mod(float x, float y)\nvec2  mod(vec2  x, float y)\nvec2  mod(vec2  x, vec2  y)',
    description:
      '返回**取模** `x - y × floor(x/y)`。\n\n' +
      '与 `fract` 的关系：`fract(x) == mod(x, 1.0)`\n\n' +
      '```glsl\nfloat t = mod(u_time, 6.2832); // 时间循环 [0, 2π)\n```\n\n' +
      '💡 生成周期循环、避免浮点精度溢出',
  },
  min: {
    signature: 'float min(float x, float y)\nvec2  min(vec2  x, vec2  y)\nvec3  min(vec3  x, vec3  y)',
    description:
      '返回两个值中的**较小者**。\n\n' +
      '```glsl\nfloat d = min(d1, d2); // SDF 并集（两个形状取近的）\n```\n\n' +
      '💡 SDF 中：`min` = 并集 (union)',
  },
  max: {
    signature: 'float max(float x, float y)\nvec2  max(vec2  x, vec2  y)\nvec3  max(vec3  x, vec3  y)',
    description:
      '返回两个值中的**较大者**。\n\n' +
      '```glsl\nfloat d = max(d1, d2); // SDF 交集（两个形状取远的）\nfloat c = max(0.0, dot(N, L)); // 漫反射光照（钳制负值）\n```\n\n' +
      '💡 SDF 中：`max` = 交集 (intersection)',
  },
  clamp: {
    signature: 'float clamp(float x, float minVal, float maxVal)\nvec2  clamp(vec2  x, float minVal, float maxVal)\nvec3  clamp(vec3  x, vec3  minVal, vec3  maxVal)',
    description:
      '将 `x` 限制在 `[minVal, maxVal]` 范围内。\n\n' +
      '等价于 `min(max(x, minVal), maxVal)`\n\n' +
      '```glsl\ncolor = clamp(color, 0.0, 1.0); // 确保颜色值合法\n```\n\n' +
      '💡 防止值溢出、颜色限幅',
  },
  mix: {
    signature: 'float mix(float x, float y, float a)\nvec2  mix(vec2  x, vec2  y, float a)\nvec3  mix(vec3  x, vec3  y, float a)\nvec3  mix(vec3  x, vec3  y, vec3  a)',
    description:
      '**线性插值**（lerp），返回 `x × (1-a) + y × a`。\n\n' +
      '- `a = 0.0` → 返回 `x`\n' +
      '- `a = 0.5` → 返回 `x` 和 `y` 的中间值\n' +
      '- `a = 1.0` → 返回 `y`\n\n' +
      '```glsl\nvec3 c = mix(red, blue, 0.5);         // 紫色\nvec3 c = mix(dayColor, nightColor, t); // 昼夜渐变\n```\n\n' +
      '💡 Shader 中最重要的函数之一！用于混合颜色、渐变、动画过渡',
  },
  step: {
    signature: 'float step(float edge, float x)\nvec2  step(vec2  edge, vec2  x)',
    description:
      '**阶跃函数**：\n' +
      '- `x < edge` → `0.0`\n' +
      '- `x ≥ edge` → `1.0`\n\n' +
      '```glsl\nfloat mask = step(0.5, uv.x); // 左半黑，右半白\n```\n\n' +
      '💡 硬边分割、二值化。想要柔和过渡请用 `smoothstep`\n\n' +
      '> 注意参数顺序：`step(阈值, 被测试值)`',
  },
  smoothstep: {
    signature: 'float smoothstep(float edge0, float edge1, float x)\nvec2  smoothstep(vec2  edge0, vec2  edge1, vec2  x)',
    description:
      '**平滑阶跃** — Hermite 插值，产生 S 曲线过渡：\n' +
      '- `x ≤ edge0` → `0.0`\n' +
      '- `x ≥ edge1` → `1.0`\n' +
      '- 之间平滑过渡（导数在端点为 0）\n\n' +
      '公式：`t = clamp((x-edge0)/(edge1-edge0), 0, 1); return t*t*(3-2*t)`\n\n' +
      '```glsl\nfloat aa = smoothstep(0.5, 0.51, dist); // 抗锯齿边缘\nvec3 c = mix(a, b, smoothstep(0.0, 1.0, uv.x)); // 柔和渐变\n```\n\n' +
      '💡 shader 必会函数！用于抗锯齿、柔和遮罩、动画缓动',
  },

  // ─── 几何/向量函数 ─────────────────────────────────────
  length: {
    signature: 'float length(float x)\nfloat length(vec2  x)\nfloat length(vec3  x)\nfloat length(vec4  x)',
    description:
      '返回向量的**长度**（欧几里得范数）`√(x²+y²+...)`。\n\n' +
      '```glsl\nfloat d = length(uv - vec2(0.5)); // 到中心的距离 → 画圆！\n```\n\n' +
      '💡 SDF 的基础 — `length(p) - r` 就是圆的距离场',
  },
  distance: {
    signature: 'float distance(float p0, float p1)\nfloat distance(vec2  p0, vec2  p1)\nfloat distance(vec3  p0, vec3  p1)',
    description:
      '返回两点间的**距离**，等价于 `length(p0 - p1)`。\n\n' +
      '```glsl\nfloat d = distance(uv, center);\n```',
  },
  dot: {
    signature: 'float dot(float x, float y)\nfloat dot(vec2  x, vec2  y)\nfloat dot(vec3  x, vec3  y)',
    description:
      '**点积**（内积），返回标量 `x₁y₁ + x₂y₂ + ...`。\n\n' +
      '几何意义：`dot(a,b) = |a|×|b|×cos(θ)`\n' +
      '- 同方向 → 正值\n' +
      '- 垂直 → 0\n' +
      '- 反方向 → 负值\n\n' +
      '```glsl\nfloat diffuse = max(0.0, dot(normal, lightDir)); // 漫反射\nfloat d2 = dot(p, p); // 距离平方（比 length 快，避免 sqrt）\n```\n\n' +
      '💡 光照计算、投影、相似度判断的核心',
  },
  cross: {
    signature: 'vec3 cross(vec3 x, vec3 y)',
    description:
      '**叉积**（外积），返回垂直于两向量的新向量。\n\n' +
      '`cross(a,b) = (a.y*b.z - a.z*b.y, a.z*b.x - a.x*b.z, a.x*b.y - a.y*b.x)`\n\n' +
      '- 结果长度 = `|a|×|b|×sin(θ)` = 平行四边形面积\n' +
      '- 方向遵循右手定则\n\n' +
      '💡 求法线方向、判断旋转方向',
  },
  normalize: {
    signature: 'float normalize(float x)\nvec2  normalize(vec2  x)\nvec3  normalize(vec3  x)',
    description:
      '返回与 `x` 同方向的**单位向量**（长度为 1）。\n\n' +
      '等价于 `x / length(x)`\n\n' +
      '```glsl\nvec3 N = normalize(normal);    // 归一化法线\nvec3 L = normalize(lightPos - fragPos); // 光线方向\n```\n\n' +
      '> ⚠️ 零向量的 normalize 结果未定义',
  },
  reflect: {
    signature: 'float reflect(float I, float N)\nvec2  reflect(vec2  I, vec2  N)\nvec3  reflect(vec3  I, vec3  N)',
    description:
      '计算**反射向量**。\n\n' +
      '- `I` = 入射方向（指向表面）\n' +
      '- `N` = 法线（必须已归一化）\n' +
      '- 公式：`I - 2.0 * dot(N, I) * N`\n\n' +
      '```glsl\nvec3 R = reflect(-lightDir, normal); // 镜面反射方向\n```\n\n' +
      '💡 Phong/Blinn-Phong 高光计算必用',
  },
  refract: {
    signature: 'float refract(float I, float N, float eta)\nvec2  refract(vec2  I, vec2  N, float eta)\nvec3  refract(vec3  I, vec3  N, float eta)',
    description:
      '计算**折射向量**（Snell 定律）。\n\n' +
      '- `I` = 入射方向（归一化）\n' +
      '- `N` = 法线（归一化）\n' +
      '- `eta` = 折射率之比（入射介质/折射介质）\n' +
      '  - 空气→玻璃 ≈ `1.0/1.5`\n' +
      '  - 空气→水 ≈ `1.0/1.33`\n\n' +
      '全内反射时返回零向量。',
  },

  // ─── 纹理采样 ──────────────────────────────────────────
  texture2D: {
    signature: 'vec4 texture2D(sampler2D sampler, vec2 coord)\nvec4 texture2D(sampler2D sampler, vec2 coord, float bias)',
    description:
      '从 2D 纹理中**采样颜色**。\n\n' +
      '- `sampler` = 纹理单元\n' +
      '- `coord` = UV 坐标 `[0,1]`\n' +
      '- 返回 `vec4(r, g, b, a)`\n\n' +
      '```glsl\nvec4 tex = texture2D(u_texture, uv);\n```\n\n' +
      '> 💡 GLSL ES 3.0 中使用 `texture()` 替代',
  },
  textureCube: {
    signature: 'vec4 textureCube(samplerCube sampler, vec3 coord)',
    description:
      '从**立方体贴图**中采样。\n\n' +
      '- `coord` = 3D 方向向量（不需要归一化）\n\n' +
      '💡 用于环境映射、天空盒',
  },

  // ─── GLSL 类型 ─────────────────────────────────────────
  float: {
    signature: 'float',
    description:
      '32 位浮点数，Shader 中最常用的标量类型。\n\n' +
      '> 💡 GLSL 中整数字面量不会自动转 float，要写 `1.0` 而非 `1`',
  },
  int: {
    signature: 'int',
    description: '有符号整数类型。常用于循环计数器和数组索引。',
  },
  bool: {
    signature: 'bool',
    description: '布尔类型，值为 `true` 或 `false`。',
  },
  vec2: {
    signature: 'vec2(float x, float y)\nvec2(float xy)',
    description:
      '2D 浮点向量，分量可通过 `.x .y` 或 `.r .g` 或 `.s .t` 访问。\n\n' +
      '```glsl\nvec2 uv = gl_FragCoord.xy / u_resolution;\nvec2 p = vec2(0.5, 0.5); // 中心点\n```\n\n' +
      '💡 UV 坐标、2D 位置的标准类型',
  },
  vec3: {
    signature: 'vec3(float x, float y, float z)\nvec3(vec2 xy, float z)\nvec3(float xyz)',
    description:
      '3D 浮点向量，分量可通过 `.xyz` 或 `.rgb` 访问。\n\n' +
      '```glsl\nvec3 color = vec3(1.0, 0.0, 0.5); // 粉红色\nvec3 pos   = vec3(uv, 0.0);       // 从 2D 扩展到 3D\n```\n\n' +
      '💡 颜色值 (RGB) 和 3D 坐标的标准类型',
  },
  vec4: {
    signature: 'vec4(float x, float y, float z, float w)\nvec4(vec3 xyz, float w)\nvec4(vec2 xy, vec2 zw)',
    description:
      '4D 浮点向量，分量可通过 `.xyzw` 或 `.rgba` 访问。\n\n' +
      '```glsl\ngl_FragColor = vec4(color, 1.0); // RGB + Alpha\n```\n\n' +
      '💡 最终颜色输出 (RGBA)、齐次坐标的标准类型',
  },
  mat2: {
    signature: 'mat2(float m00, float m10, float m01, float m11)\nmat2(vec2 col0, vec2 col1)\nmat2(float diagonal)',
    description:
      '2×2 浮点矩阵（**列优先**存储）。\n\n' +
      '```glsl\nmat2 rot = mat2(cos(a), sin(a), -sin(a), cos(a)); // 2D 旋转\nvec2 p = rot * uv; // 矩阵乘法\n```\n\n' +
      '💡 2D 旋转、缩放变换',
  },
  mat3: {
    signature: 'mat3(vec3 col0, vec3 col1, vec3 col2)\nmat3(float diagonal)',
    description:
      '3×3 浮点矩阵（**列优先**存储）。\n\n' +
      '💡 3D 旋转、法线变换（法线矩阵通常是模型矩阵逆的转置的 3×3 部分）',
  },
  mat4: {
    signature: 'mat4(vec4 col0, vec4 col1, vec4 col2, vec4 col3)\nmat4(float diagonal)',
    description:
      '4×4 浮点矩阵（**列优先**存储）。\n\n' +
      '💡 模型-视图-投影变换 (MVP) 的标准类型',
  },
  sampler2D: {
    signature: 'sampler2D',
    description: '2D 纹理采样器，与 `texture2D()` 配合使用。\n\n只能声明为 `uniform`。',
  },
  samplerCube: {
    signature: 'samplerCube',
    description: '立方体贴图采样器，与 `textureCube()` 配合使用。\n\n只能声明为 `uniform`。',
  },
  ivec2: { signature: 'ivec2', description: '2D 整数向量。' },
  ivec3: { signature: 'ivec3', description: '3D 整数向量。' },
  ivec4: { signature: 'ivec4', description: '4D 整数向量。' },
  bvec2: { signature: 'bvec2', description: '2D 布尔向量。' },
  bvec3: { signature: 'bvec3', description: '3D 布尔向量。' },
  bvec4: { signature: 'bvec4', description: '4D 布尔向量。' },

  // ─── 修饰符 / 限定符 ──────────────────────────────────
  uniform: {
    signature: 'uniform type name;',
    description:
      '**Uniform 变量** — 由 CPU 端传入，在整个绘制调用中保持不变。\n\n' +
      '所有片元共享同一个值（"统一"的含义）。\n\n' +
      '常见 uniform：\n' +
      '- `u_time` — 动画时间\n' +
      '- `u_resolution` — 画布分辨率\n' +
      '- `u_mouse` — 鼠标位置',
  },
  varying: {
    signature: 'varying type name;',
    description:
      '**Varying 变量** — 从顶点着色器传递到片元着色器，GPU 自动在三角形内部进行插值。\n\n' +
      '> 💡 GLSL ES 3.0 中被 `in/out` 替代',
  },
  attribute: {
    signature: 'attribute type name;',
    description:
      '**Attribute 变量** — 每个顶点有不同的值（位置、法线、UV 等）。\n\n' +
      '只能在顶点着色器中使用。\n\n' +
      '> 💡 GLSL ES 3.0 中被 `in` 替代',
  },
  precision: {
    signature: 'precision highp float;\nprecision mediump float;',
    description:
      '设置默认的浮点精度。\n\n' +
      '- `highp` — 高精度（32位），推荐在片元着色器中使用\n' +
      '- `mediump` — 中等精度（16位），移动端默认\n' +
      '- `lowp` — 低精度（8位）\n\n' +
      '> 💡 片元着色器中没有默认 float 精度，必须声明！',
  },
  const: {
    signature: 'const type name = value;',
    description: '编译时常量。必须在声明时初始化，之后不可修改。',
  },
  highp: {
    signature: 'highp',
    description: '高精度限定符（至少 32 位浮点）。桌面端默认。',
  },
  mediump: {
    signature: 'mediump',
    description: '中精度限定符（至少 16 位浮点）。移动端片元着色器常用。',
  },
  lowp: {
    signature: 'lowp',
    description: '低精度限定符（至少 8 位）。颜色等低精度数据可用。',
  },

  // ─── 常用 uniform（项目特有）───────────────────────────
  u_time: {
    signature: 'uniform float u_time',
    description:
      '**动画时间**（秒），每帧自动递增。\n\n' +
      '```glsl\nfloat wave = sin(u_time * 2.0); // 2Hz 正弦波动画\nvec2 p = uv + vec2(cos(u_time), sin(u_time)) * 0.1; // 圆形运动\n```',
  },
  u_resolution: {
    signature: 'uniform vec2 u_resolution',
    description:
      '**画布分辨率** `(宽度, 高度)`，单位为像素。\n\n' +
      '```glsl\nvec2 uv = gl_FragCoord.xy / u_resolution; // 归一化到 [0,1]\nfloat aspect = u_resolution.x / u_resolution.y; // 宽高比\n```',
  },
  u_mouse: {
    signature: 'uniform vec2 u_mouse',
    description:
      '**鼠标位置**，归一化到 `[0, 1]`。\n\n' +
      '```glsl\nvec2 m = u_mouse;\nfloat d = length(uv - m); // 到鼠标的距离\n```',
  },
};
