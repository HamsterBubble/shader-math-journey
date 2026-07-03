# 课程约定

每节课是一个独立文件夹，通过 Vite `?raw` 导入在构建期打包进 bundle。

## 文件夹结构

```
src/lessons/stageN/XX-slug/
├── meta.js              # 元数据（必填）
├── instructions.html    # 教学说明 HTML（必填）
├── code.glsl            # 骨架代码（必填）
└── goal.glsl            # 目标着色器（仅 Challenge）
```

- `XX` 为两位序号，`slug` 为短横线命名
- `N` 为 stage 编号 1–7

## meta.js

```js
export const meta = {
  id: 'hello-gradient',   // 全局唯一，kebab-case
  stage: 1,               // 必须与文件夹 stageN 一致
  title: '你好，渐变！',
  badge: '入门',          // 见下方 badge 约定
};
```

### badge 常用值

| badge | 含义 |
|-------|------|
| 入门 | 阶段首课或基础概念 |
| 函数 / 概念 / 核心 | 普通教学课 |
| 进阶 / GPU / 光照 等 | 专题课 |
| 挑战 | Challenge（应配 goal.glsl） |
| 终极 | Stage 7 高难度挑战 |

Challenge 判定：`badge === '挑战'` **或** 存在 `goalCode`（见 `Sidebar.isChallenge`）。

## instructions.html

- 纯 HTML 片段（无 `<html>` 包裹），由 `dangerouslySetInnerHTML` 渲染
- 常用 CSS class：`info-box`、`formula-block`、`tip`（样式在 `src/style.css`）
- Challenge 须在合适位置包含目标预览画布：

```html
<canvas class="goal-canvas"></canvas>
```

- 知识点链接（可手动添加或由脚本注入）：

```html
<a class="knowledge-link" data-page="/learn-uv-remap.html" data-title="坐标居中">
  <span class="kl-icon">📐</span><span class="kl-text">坐标居中原理</span>
</a>
```

或运行 `node scripts/inject-knowledge-links.mjs` 自动注入。

## code.glsl

骨架着色器，学习者编辑的起点。推荐统一头部：

```glsl
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  // ...
  gl_FragColor = vec4(color, 1.0);
}
```

可用 uniform（由 `ShaderRenderer` 自动注入，可选）：

| uniform | 类型 | 说明 |
|---------|------|------|
| `u_time` | float | 启动后秒数 |
| `u_resolution` | vec2 | 画布像素尺寸 |
| `u_mouse` | vec2 | 鼠标位置（左下原点） |

## goal.glsl（Challenge）

- 完整可运行的 fragment shader，展示目标视觉效果
- 不在主编辑器显示，仅通过 `goalCode` 在说明面板 `.goal-canvas` 预览

## 注册到 stage index

新增或删除课程后，**必须**更新 `src/lessons/stageN/index.js`：

```js
import { meta as lessonXXMeta } from './XX-slug/meta.js';
import lessonXXInstructions from './XX-slug/instructions.html?raw';
import lessonXXCode from './XX-slug/code.glsl?raw';
// Challenge 额外：
import lessonXXGoal from './XX-slug/goal.glsl?raw';

export const stageN = [
  // ...
  { ...lessonXXMeta, instructions: lessonXXInstructions, code: lessonXXCode },
  // Challenge:
  { ...lessonXXMeta, instructions: lessonXXInstructions, code: lessonXXCode, goalCode: lessonXXGoal },
];
```

> 文件头标注「Auto-generated」，但仓库内暂无 regen 脚本——按上述模式手动维护。

`src/lessons/index.js` 仅在新增 stage 时需修改；同 stage 内增删课只改 `stageN/index.js`。

## 维护 checklist

- [ ] 创建文件夹与四个文件（Challenge 含 goal.glsl）
- [ ] `meta.id` 全局唯一（查 `docs/CURRICULUM.md`）
- [ ] `meta.stage` 与目录 `stageN` 一致
- [ ] 更新 `stageN/index.js` imports 与 export 数组
- [ ] Challenge：`instructions.html` 含 `.goal-canvas`，`badge: '挑战'`
- [ ] 运行 `npm run docs:curriculum` 更新索引
- [ ] （可选）运行 `node scripts/inject-knowledge-links.mjs` 注入知识点链接

## 不要做的事

- 不要修改 `dist/` 中的课程文件 — 那是构建产物
- 不要为普通 Lesson 添加 `goal.glsl`（除非有意做成 Challenge）
- 不要在 `meta.js` 以外的地方定义 lesson id
