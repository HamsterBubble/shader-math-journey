# AI Agent 指南

本文件是 AI 代理的**唯一入口**。开始任何任务前读本文，再按需跳转子文档。**禁止**无目的地扫描整个代码库。

## 必读顺序

1. [CONTEXT.md](./CONTEXT.md) — 领域术语（Lesson / Challenge / Goal Shader 等）
2. [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — 组件关系与数据流
3. 按任务类型跳转下方「任务速查表」

## 禁止事项

- **不要** `glob` / `read` 整个 `src/lessons/` 目录树
- **不要** 从代码推断课程总数或列表 — 以 [docs/CURRICULUM.md](./docs/CURRICULUM.md) 为准
- **不要** 手改 `src/lessons/stage*/index.js` 以外的「Auto-generated」文件而不更新 index
- **不要** 假设存在测试框架、API 后端、数据库 — 本项目是纯前端 SPA
- **不要** 在应用内嵌入完整案例工程源码浏览器 — 完整源码由学习者在本地 IDE 查看（见 [case-schema](./docs/specs/case-schema.md)）

## 任务速查表

| 任务 | 只读这些 |
|------|----------|
| 了解项目全貌 | 本文件 + CONTEXT.md + ARCHITECTURE.md |
| 查有哪些课 / 某课在哪 | `docs/CURRICULUM.md` |
| 修改一节课 | `src/lessons/stageN/XX-slug/` 下 2–4 个文件 + [LESSON-CONVENTIONS](./docs/LESSON-CONVENTIONS.md) |
| 新增一节课 | LESSON-CONVENTIONS + 同 stage 现有课作参考 + 更新 `stageN/index.js` |
| 更新课程索引 | `npm run docs:curriculum` |
| 改知识点注册 / 自动注入链接 | `src/config/knowledge.js` + `scripts/inject-knowledge-links.mjs` + [knowledge-system spec](./docs/specs/knowledge-system.md) |
| 改 WebGL 渲染 / uniform | `src/core/shader-renderer.js` + [renderer spec](./docs/specs/renderer.md) |
| 改编辑器 / GLSL 高亮 | `src/components/CodeEditor.jsx` + `src/core/glsl-docs.js` |
| 改侧边栏 / 进度 | `src/components/Sidebar.jsx` + `src/App.jsx` |
| 改知识点面板 | `src/components/KnowledgePanel.jsx` + `public/learn-*.html` |
| 改练习场 | `src/components/PracticeArena.jsx` + `src/practice/` |
| 改函数图像 | `src/components/GraphLab.jsx` + `src/graph/` |
| 构建 Full Case Preview | `threejs-case/01-dracarys` build → `public/cases/dracarys/` |
| 架构决策背景 | `docs/adr/` |

## 项目快照

| 项 | 值 |
|----|-----|
| 名称 | shader-math-journey（Shader 数学之旅） |
| 栈 | React 19 + Vite 8 + Monaco + WebGL |
| 入口 | `src/main.jsx` → `src/App.jsx` |
| 课程注册 | `src/lessons/index.js` |
| 案例注册 | `src/cases/index.js` |
| 开发端口 | `3456`（见 `vite.config.js`） |
| 构建 | `npm run build` → `dist/` |

## 文档地图

```
AGENTS.md              ← 你在这里
CONTEXT.md             ← 术语表
docs/
├── ARCHITECTURE.md    ← 架构
├── LESSON-CONVENTIONS.md
├── CURRICULUM.md      ← 课程索引（自动生成）
├── specs/
│   ├── lesson-schema.md
│   ├── case-schema.md
│   ├── renderer.md
│   └── knowledge-system.md
└── adr/               ← 架构决策记录
```
