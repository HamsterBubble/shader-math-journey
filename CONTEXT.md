# Shader Math Journey

交互式 GLSL 着色器数学学习平台。学习者通过编辑骨架代码、对照目标预览，循序渐进掌握 Shader 编程中的数学概念。

## Language

**Stage（阶段）**:
课程体系的一级分组，共 7 个阶段，每个阶段聚焦一类数学主题。
_Avoid_: 章节, module, level

**Lesson（课程）**:
一节可学习的单元，包含教学说明、可编辑的骨架着色器代码，并在主预览区实时渲染。
_Avoid_: 课时, tutorial（泛指时）

**Challenge（挑战）**:
一种特殊的 Lesson，要求学习者独立实现目标效果；提供 Goal Shader 作为参考预览。
_Avoid_: 作业, exercise, quiz

**Skeleton Code（骨架代码）**:
每节课 `code.glsl` 中的起始代码，含注释引导，学习者在 Monaco 编辑器中修改它。
_Avoid_: 模板, starter, boilerplate

**Goal Shader（目标着色器）**:
Challenge 专用，存放于 `goal.glsl`，经 `goalCode` 字段注入后在说明面板的 `.goal-canvas` 中预览，不参与主编辑器。
_Avoid_: 答案, solution, reference shader

**Knowledge Point（知识点）**:
跨课程复用的概念说明，注册于 `src/config/knowledge.js`，对应 `public/learn-*.html` 静态页。
_Avoid_: 文档, wiki entry

**Knowledge Link（知识点链接）**:
嵌入 `instructions.html` 的 `<a class="knowledge-link">` 标签，点击后在右侧 Knowledge Panel 以 iframe 打开对应页面。
_Avoid_: 外链, 帮助链接

**Instruction Panel（说明面板）**:
左侧渲染 `instructions.html` 的区域，含目标预览画布与知识点链接。
_Avoid_: 教程区, docs panel

**Main Preview（主预览）**:
右侧 WebGL 画布，实时编译并渲染学习者在编辑器中编写的 Skeleton Code。
_Avoid_: 输出区, canvas（无上下文时）

**Progress（学习进度）**:
用户标记为已完成的 Lesson/Challenge 列表，持久化于浏览器 `localStorage` 键 `completedLessons`。
_Avoid_: 分数, 成就

**Graph Lab（函数图像）**:
类似 GeoGebra 的函数图像工具弹窗：左侧输入多条 `y = f(x)` 表达式，右侧 Canvas 绘制；自动同步到进度服务器（`graphBoards`，单板）。
_Avoid_: 绘图板, 计算器

**Case Progress（案例进度）**:
用户标记为已完成的 Case Step 列表，持久化于 `localStorage` 键 `completedCaseSteps`；与 **Progress** 分离存储。
_Avoid_: 分数, 成就

**Case（案例）**:
以真实项目为语境的综合学习单元，聚焦一个完整视觉效果（如 Dracarys 龙场景）。由多个 **Case Step** 组成，每步只讲一个子系统（封面、水面、模型粒子等）。
_Avoid_: 示例, demo（无学习结构时）, gallery entry

**Case Step（案例步骤）**:
案例内的单节学习单元，含说明、**Practice Bundle**、**Step Goal Preview** 与 **Practice Preview**，并关联 **Knowledge Point**。每步只聚焦一个技术关注点（封面、水面、粒子等）。
_Avoid_: 课时, 章节

**Full Case Preview（完整案例预览）**:
整个案例的可交互完整 demo（如 Dracarys 全场景），通过**新窗口**打开，供学习者在练习时对照参考；不嵌入主工作区。
_Avoid_: 观摩模式, 内嵌 demo

**Step Goal Preview（步骤目标预览）**:
Case Step 专用：仅包含该步子系统的**最终效果**只读预览（迷你场景，非完整案例），类似 Challenge 的 **Goal Shader**，用于对照学习者的 **Practice Preview**。
_Avoid_: 答案区, 完整场景预览

**Practice Preview（练习预览）**:
Case Step 中学习者编辑 **Practice Bundle** 后的实时预览，运行环境与 **Step Goal Preview** 相同的迷你场景，但挂载用户代码。
_Avoid_: 主预览（Lesson 语境下）, sandbox output

**Practice Mode（练习模式）**:
Case Step 的默认工作区：编辑 **Practice Bundle**（shader 为主 + TS 可编辑区），同时展示 **Practice Preview** 与 **Step Goal Preview**。
_Avoid_: 实验模式, 完整源码阅读器

**Practice Bundle（练习包）**:
单个 Case Step 在练习模式下暴露的文件集合：1 个可编辑核心 shader 文件 + 0–1 个 TS 挂载文件。TS 中场景搭建为只读；`// editable` 标记区域内的 uniform 默认值与强度参数可编辑。完整案例源码不在应用内提供，由学习者在本地 IDE 查看。
_Avoid_: 子项目, fork

**Editable Region（可编辑区）**:
Practice Bundle 内 TS 文件中由 `// editable` 标记包裹的代码段，仅允许修改 uniform 默认值与调参常量；场景搭建与管线逻辑保持只读。
_Avoid_: 配置块, 参数区（无标记语义时）

**Case Tab（案例板块）**:
侧边栏第三个标签，列出全部 **Case**；选中后进入案例学习流（非 Lesson 编辑流）。
_Avoid_: 示例库, gallery

## Relationships

- 一个 **Stage** 包含多节 **Lesson** 和零到多个 **Challenge**
- 每节 **Lesson** 恰好属于一个 **Stage**
- **Challenge** 是 **Lesson** 的子类型：必有 **Goal Shader**，且 `badge` 通常为「挑战」
- 一个 **Case** 包含多节 **Case Step**，按固定顺序学习
- **Case** 与 **Lesson** 并列，不属于任何 **Stage**；**Case Step** 可引用已有 **Lesson** 与 **Knowledge Point** 作为前置或延伸阅读
- **Skeleton Code** 驱动 **Main Preview**；**Goal Shader** 仅驱动说明面板中的目标预览
- **Case** 提供 **Full Case Preview**（新窗口）；每个 **Case Step** 提供 **Step Goal Preview** + **Practice Preview** 成对对照
- **Case Step** 通过 **Practice Bundle** 驱动 **Practice Preview**；**Step Goal Preview** 使用同场景结构的只读目标实现（`goal.*`）
- **Knowledge Link** 引用一个 **Knowledge Point**；一门课可含多个 Knowledge Link
- **Progress** 按 Lesson 的 `id` 记录，不区分 Lesson 与 Challenge 的存储方式
- **Case Progress** 按 Case Step 的 `id` 记录于 `completedCaseSteps`

## Example dialogue

> **Dev:** "我要给 Stage 3 加一节普通课，需要 Goal Shader 吗？"
> **Domain expert:** "不需要。普通 Lesson 只有 Skeleton Code；只有 Challenge 才需要 `goal.glsl` 和说明里的 `.goal-canvas`。"

> **Dev:** "侧边栏「挑战」标签里的课和「课程」标签里的课有什么区别？"
> **Domain expert:** "同一套 Lesson 数据，按 `badge === '挑战'` 或是否存在 `goalCode` 分流展示。挑战课在挑战标签下显示 🏆 图标。"

> **Dev:** "案例里的练习和 Stage 里的课有什么区别？"
> **Domain expert:** "案例练习是 **Case Step** 的 **Practice Mode**：从完整项目中抽出该步的核心数学，在隔离沙盒里验证；Lesson 是独立课程，不绑案例 demo 语境。"

> **Dev:** "案例里「完整预览」和每步的「目标预览」有什么区别？"
> **Domain expert:** "**Full Case Preview** 是新窗口打开的整个 Dracarys；**Step Goal Preview** 只是该步那一块（比如只有水面）的最终效果，和 **Practice Preview** 并排对照，就像 Challenge 里的 Goal Shader。"

## Flagged ambiguities

- `stage*/index.js` 标注 Auto-generated，但仓库内暂无自动 regen 脚本；新增课程时需手动更新对应 `index.js`。
