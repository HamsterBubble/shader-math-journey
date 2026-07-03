# 案例：Practice Bundle + 三层预览 + 独立进度

案例（Case）与课程（Lesson）采用双轨架构。每个 Case Step 从完整项目中抽取 **Practice Bundle**（核心 shader + 只读 TS 挂载 + `// editable` 调参区），学习者在迷你 Three.js 或 fragment 场景中编辑并预览；**Step Goal Preview** 提供同场景的只读目标效果对照。完整案例 demo 以预构建静态站部署于 `public/cases/<slug>/`，通过新窗口打开（**Full Case Preview**），不嵌入主工作区，也不在应用内浏览完整工程源码。

**Considered Options:** 内嵌 iframe 观摩 tab；应用内只读浏览 Dracarys 全部 39 个源文件；练习仅用现有 ShaderRenderer 全屏 fragment（无法承载 GPGPU/多 pass）；案例进度写入 `completedLessons`。

**Consequences:** 需新增 `src/cases/`、`CaseWorkspace`、按步 `PracticeRuntime`（`fragment` | `three`）及 `esbuild-wasm` 懒加载；`three` 仅案例练习动态 import，Lesson 轨仍遵守 ADR-0001。案例进度使用独立键 `localStorage.completedCaseSteps`。每步需作者维护 `practice/` 与 `goal/` 两套文件及对应知识点页。
