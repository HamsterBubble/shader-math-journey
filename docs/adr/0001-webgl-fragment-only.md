# WebGL 1.0 仅 Fragment Shader 渲染

项目使用自定义 `ShaderRenderer`，固定全屏 quad + 用户 fragment shader，不暴露 vertex shader 编辑。选择 WebGL 1.0（`gl_FragColor`）而非 WebGL2/GLSL ES 3.00，因为学习者课程全部基于 `gl_FragCoord`/`gl_FragColor` 写法，且无需 `#version` 指令降低入门门槛。Monaco 注册的 GLSL 语法与 hover 文档亦按 WebGL 1.0 内置函数编写。

**Considered Options:** WebGL2 + `out vec4 fragColor`（更现代但增加第一课认知负担）；Three.js 封装（隐藏了 shader 编译细节，与教学目标冲突）。

**Consequences:** 无法使用 `dFdx`/`dFdy` 以外的现代 GPU 特性需额外说明；迁移到 WebGL2 需批量改写全部 `code.glsl`/`goal.glsl`。
