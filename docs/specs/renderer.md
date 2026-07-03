# ShaderRenderer

`src/core/shader-renderer.js` — WebGL 1.0 全屏四边形 fragment shader 渲染器。

## 职责

- 创建 WebGL context（`webgl` 或 `experimental-webgl`）
- 用固定 vertex shader 绘制全屏 quad（6 顶点，两个三角形）
- 编译、链接用户提供的 fragment shader
- 每帧注入 uniform 并 `drawArrays`

## 固定 Vertex Shader

```glsl
attribute vec2 a_position;
void main(){ gl_Position = vec4(a_position, 0.0, 1.0); }
```

## 自动 Uniform

| uniform | 注入条件 | 值 |
|---------|----------|-----|
| `u_time` | shader 中声明了该 uniform | 自实例创建起的秒数 |
| `u_resolution` | 声明了 | `[canvas.width, canvas.height]` 像素 |
| `u_mouse` | 声明了 | `[x, y]`，y 为 canvas 左下原点 |

未声明的 uniform 不会报错——`getUniformLocation` 返回 null 时跳过。

## API

### `constructor(canvas: HTMLCanvasElement)`

初始化 quad、事件监听、ResizeObserver（监听 parent 尺寸）。

### `setShader(fragSrc: string): { ok: boolean, error?: string }`

- 删除旧 program，编译新 fragment shader
- 失败时 `program = null`，返回 `{ ok: false, error }`
- 成功返回 `{ ok: true }`

### `start()` / `stop()`

`requestAnimationFrame` 渲染循环。

### `destroy()`

停止动画、断开 ResizeObserver、删除 program。

## 使用位置

| 组件 | 实例数 | 说明 |
|------|--------|------|
| `PreviewCanvas` | 1 | 主预览，编译学习者代码 |
| `InstructionPanel` | 0–1 | 仅 Challenge，渲染 `goalCode` |

## 画布尺寸

- DPR 上限 2
- 随 parent 元素 resize 自动调整 `canvas.width/height`

## 学习者代码约定

- 使用 `gl_FragColor` 输出（WebGL 1.0 风格，非 `#version 300 es`）
- 推荐 `precision mediump float;`
- 典型入口：`vec2 uv = gl_FragCoord.xy / u_resolution.xy;`

## 错误传递

编译/链接错误字符串返回给 `App.compileStatus`，由 `CodeEditor` 解析行号设置 Monaco markers。
