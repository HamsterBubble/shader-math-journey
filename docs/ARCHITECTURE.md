# 架构

Shader Math Journey 是纯前端 SPA：React 壳 + 静态课程资源 + WebGL 片段着色器实时预览。案例（Case）轨与课程（Lesson）轨并列，见 [ADR-0004](./adr/0004-case-practice-bundle.md)。

## 组件图

### Lesson 轨（现有）

```
main.jsx
  └── App.jsx  (viewMode: lesson)
        ├── lessons/index.js ──→ stages[], lessons[]
        ├── Sidebar.jsx          课程导航（课程 / 挑战 / 案例）
        ├── Toolbar.jsx          标题、完成标记、上/下节、重置
        ├── InstructionPanel.jsx  instructions.html + goal 预览
        ├── PreviewCanvas.jsx ──→ ShaderRenderer  主预览
        ├── CodeEditor.jsx       Monaco GLSL 编辑器
        ├── KnowledgePanel.jsx   知识点列表 + iframe 详情
        ├── PracticeArena.jsx    练习场弹窗
        └── GraphLab.jsx         函数图像弹窗
```

### Case 轨（规划）

```
main.jsx
  └── App.jsx  (viewMode: case)
        ├── cases/index.js ──→ cases[], caseSteps[]
        ├── Sidebar.jsx          案例列表 + Case Progress
        ├── CaseToolbar.jsx      步骤导航、完成标记、「完整预览 ↗」
        ├── InstructionPanel.jsx 步骤说明 + 知识点链接
        ├── CasePracticePane.jsx  Step Goal Preview ∥ Practice Preview
        ├── CaseEditor.jsx       Monaco 多标签（Practice Bundle）
        ├── PracticeRuntime      fragment | three（动态 import）
        └── KnowledgePanel.jsx   同 Lesson 轨
```

## 数据流

### 课程加载

1. Vite 在构建时通过 `?raw` 将每课的 `instructions.html`、`code.glsl`、`goal.glsl` 内联为字符串
2. `src/lessons/stageN/index.js` 聚合该阶段所有课，导出对象数组
3. `src/lessons/index.js` 合并 7 个 stage，导出 `stages` 与 `lessons`
4. `App.jsx` 用 `lessons[currentIndex]` 驱动全部 UI

### 着色器编译与预览

```
CodeEditor onChange (debounce 250ms)
  → App.handleCompile(code)
    → ShaderRenderer.setShader(code)
      → WebGL compile/link
        → compileStatus { ok, error }
          → PreviewCanvas 状态条 + CodeEditor 错误标记
```

切换课程时 `PreviewCanvas` 自动用新课的 `lesson.code` 编译。

### Goal 预览（仅 Challenge）

`InstructionPanel` 在 `lesson.goalCode` 存在时，查找说明 HTML 内的 `<canvas class="goal-canvas">`，创建独立 `ShaderRenderer` 实例渲染目标效果。

### 学习进度

**Lesson 轨**

- 状态：`App.jsx` 中 `completedLessons: string[]`（lesson id 列表）
- 持久化：`localStorage.completedLessons`
- 启动时自动跳到第一个未完成的课

**Case 轨**

- 状态：`completedCaseSteps: string[]`（case step id 列表）
- 持久化：`localStorage.completedCaseSteps`
- 与 `completedLessons` 分离；侧边栏案例 tab 显示步进完成度

### 知识点系统

- 注册表：`src/config/knowledge.js` → `KNOWLEDGE_POINTS[]`
- 静态页：`public/learn-*.html`、`public/explain-*.html`
- 注入脚本：`scripts/inject-knowledge-links.mjs` 扫描 `code.glsl` 模式，向 `instructions.html` 写入 `<a class="knowledge-link">`
- 交互：`InstructionPanel` 事件委托 → `App` → `KnowledgePanel` iframe

## 目录职责

| 路径 | 职责 |
|------|------|
| `src/App.jsx` | 根状态：当前课、编译状态、进度、知识点选中 |
| `src/components/` | 纯 UI 组件 |
| `src/core/shader-renderer.js` | WebGL 全屏四边形 + fragment shader |
| `src/core/glsl-docs.js` | Monaco hover 文档数据 |
| `src/config/knowledge.js` | 知识点注册表 |
| `src/lessons/` | 全部课程内容（最大目录） |
| `src/cases/` | 案例与 Case Step（Practice Bundle + goal） |
| `public/cases/` | Full Case Preview 预构建静态站 |
| `public/` | 知识点静态 HTML（不经 React 路由） |
| `scripts/` | 维护工具（课程索引生成、知识点链接注入） |

## Lesson 对象运行时形状

```js
{
  id: string,           // 全局唯一，如 'hello-gradient'
  stage: number,        // 1–7
  title: string,
  badge: string,        // '入门' | '挑战' | '进阶' | ...
  instructions: string, // HTML 字符串
  code: string,         // 骨架 GLSL
  goalCode?: string,    // 仅 Challenge
}
```

## 侧边栏三分栏

| 标签 | 数据源 | 说明 |
|------|--------|------|
| 课程 | `!isChallenge(lesson)` | 普通课，按 stage 分组 |
| 挑战 | `isChallenge(lesson)` | `badge === '挑战'` 或存在 `goalCode` |
| 案例 | `cases[]` / `caseSteps[]` | 按案例分组；选中进入 Case 轨（见 [case-schema](./specs/case-schema.md)） |

`isChallenge` 定义于 `src/components/Sidebar.jsx`。

## 技术约束

### Lesson 轨

- **仅 WebGL 1.0** fragment shader，无 vertex shader 自定义（固定全屏 quad）
- **Monaco GLSL**：自定义 monarch tokenizer + `shader-dark` 主题

### Case 轨

- **Practice Bundle**：每步 1 shader + 可选 `setup.ts`（`// editable` 调参区）
- **`runtime: 'three'`** 步骤使用迷你 Three.js 场景 + `esbuild-wasm` 懒加载；`three` 动态 import，不进入 Lesson 首屏
- **Full Case Preview**：`public/cases/<slug>/`，新窗口打开，不嵌入主工作区

### 全局

- **无后端**：无用户账号、无服务端保存代码
- **无路由库**：单页，Lesson / Case 切换靠 React state

## 相关文档

- [LESSON-CONVENTIONS.md](./LESSON-CONVENTIONS.md) — 课程文件约定
- [specs/renderer.md](./specs/renderer.md) — ShaderRenderer 行为
- [specs/lesson-schema.md](./specs/lesson-schema.md) — 课程文件结构
- [specs/case-schema.md](./specs/case-schema.md) — 案例文件结构
- [adr/0001-webgl-fragment-only.md](./adr/0001-webgl-fragment-only.md)
- [adr/0004-case-practice-bundle.md](./adr/0004-case-practice-bundle.md)
