# Lesson Schema

一节课在文件系统与运行时中的结构规范。

## 文件清单

| 文件 | 必填 | 说明 |
|------|------|------|
| `meta.js` | 是 | 导出 `meta` 对象 |
| `instructions.html` | 是 | HTML 片段 |
| `code.glsl` | 是 | 骨架 fragment shader |
| `goal.glsl` | Challenge 必填 | 目标 fragment shader |

## meta 字段

| 字段 | 类型 | 约束 |
|------|------|------|
| `id` | string | 全局唯一，kebab-case，与文件夹 slug 通常相关但不强制相同 |
| `stage` | number | 1–7，须与 `stageN/` 目录一致 |
| `title` | string | 侧边栏与工具栏显示名 |
| `badge` | string | 短标签，Challenge 用 `'挑战'` |

## 运行时 Lesson 对象

构建时由 `stageN/index.js` 组装：

| 字段 | 来源 | 说明 |
|------|------|------|
| `id`, `stage`, `title`, `badge` | `meta.js` | spread 自 meta |
| `instructions` | `instructions.html?raw` | 字符串 |
| `code` | `code.glsl?raw` | 字符串 |
| `goalCode` | `goal.glsl?raw` | 可选，仅 Challenge |

## Challenge 判定

满足任一即为 Challenge：

1. `badge === '挑战'`
2. 存在 `goalCode` 字段

实现：`src/components/Sidebar.jsx` → `isChallenge()`

## instructions.html 要求

- Challenge 必须包含 `<canvas class="goal-canvas"></canvas>` 供 `InstructionPanel` 挂载 WebGL
- 知识点链接使用 `class="knowledge-link"` + `data-page` + `data-title`

## 索引注册

课程必须出现在 `src/lessons/stageN/index.js` 的 export 数组中，否则不会加载。

课程总览见 [CURRICULUM.md](../CURRICULUM.md)（`npm run docs:curriculum` 生成）。
