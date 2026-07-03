# Case Schema

案例与课程并列，术语见 [CONTEXT.md](../../CONTEXT.md)。架构背景见 [ADR-0004](../adr/0004-case-practice-bundle.md)。

## 目录结构

```
src/cases/
├── index.js                    # 导出 cases[], caseSteps[]（扁平，含 caseId）
└── dracarys/
    ├── meta.js                 # Case 元数据
    ├── index.js                # 聚合本案例全部 Case Step
    └── steps/
        └── 03-water/
            ├── meta.js
            ├── instructions.html
            ├── practice/
            │   ├── sim.glsl          # 骨架 shader（主编辑）
            │   └── setup.ts          # 迷你场景；含 // editable 区
            └── goal/
                ├── sim.glsl          # 目标 shader
                └── setup.ts          # 同结构只读目标场景

public/cases/dracarys/          # Full Case Preview（预构建，新窗口打开）
```

## Case meta 字段

| 字段 | 类型 | 约束 |
|------|------|------|
| `id` | string | 全局唯一，kebab-case，如 `dracarys` |
| `title` | string | 侧边栏与工具栏显示名 |
| `badge` | string | 短标签，如 `案例` |
| `fullPreviewUrl` | string | 相对路径，如 `/cases/dracarys/` |
| `description` | string | 可选，侧边栏副标题 |
| `learningPath` | string[] | 可选，跨 Stage 预习的 Lesson `id` 顺序 |
| `knowledgeIds` | string[] | 关联 `knowledge.js` 中的 id |

## Case Step meta 字段

| 字段 | 类型 | 约束 |
|------|------|------|
| `id` | string | 全局唯一，建议 `{caseId}-{nn}-{slug}`，如 `dracarys-03-water` |
| `caseId` | string | 所属 Case 的 `id` |
| `order` | number | 案例内顺序，从 1 起 |
| `title` | string | 步骤标题 |
| `badge` | string | 短标签，如 `水面` |
| `runtime` | string | `'fragment'` \| `'three'` |
| `prerequisites` | string[] | 可选，建议先学 Lesson id 或 Knowledge Point id |
| `knowledgeIds` | string[] | 关联 `knowledge.js` 中的 id |

## 运行时 Case Step 对象

构建时由 `cases/dracarys/index.js` 组装：

| 字段 | 来源 | 说明 |
|------|------|------|
| `id`, `caseId`, `order`, `title`, `badge`, `runtime`, … | `meta.js` | spread 自 meta |
| `instructions` | `instructions.html?raw` | HTML 字符串 |
| `practiceFiles` | `practice/*?raw` | `{ path, language, content }[]` |
| `goalFiles` | `goal/*?raw` | 同结构，只读目标 |

## Practice Bundle 约定

### 文件数量

- **必填**：1 个核心 shader（`.glsl`）
- **可选**：1 个 `setup.ts`（`runtime === 'three'` 时必填）

### shader 文件

- 学习者主要编辑对象
- WebGL 1.0 语法（`texture2D`、`gl_FragColor`），与 Lesson 一致
- 骨架代码含 `// TODO` 注释引导

### setup.ts

- 场景、相机、FBO、材质挂载逻辑为**只读**
- uniform 默认值与调参常量放在 `// editable` … `// end editable` 之间，学习者可改
- 导出约定（实现期确定具体签名）：

```ts
export function createStepScene(canvas: HTMLCanvasElement, shaders: { sim: string }): StepSceneHandle;
export function disposeStepScene(handle: StepSceneHandle): void;
```

### fragment runtime

`runtime === 'fragment'` 时仅需 `practice/sim.glsl`（及 `goal/sim.glsl`），复用 `ShaderRenderer`，无 `setup.ts`。

## 三层预览

| 预览 | 触发 | 数据源 |
|------|------|--------|
| **Full Case Preview** | 工具栏「完整预览 ↗」`target="_blank"` | `case.fullPreviewUrl` |
| **Step Goal Preview** | 练习区并排画布（只读） | `goalFiles` + `PracticeRuntime` |
| **Practice Preview** | 练习区并排画布（可编辑） | 用户当前编辑的 `practiceFiles` |

## 进度

- 键：`localStorage.completedCaseSteps`
- 值：`string[]`，元素为 Case Step 的 `id`
- 与 `completedLessons` 分离；侧边栏案例 tab 显示 `已完成步数 / 总步数`

## instructions.html 要求

- 使用 `class="knowledge-link"` + `data-page` + `data-title` 引用知识点
- 说明本步在完整案例中的视觉位置（文字/示意图），并提示可用「完整预览」新窗口对照
- **不要**嵌入完整案例 iframe

## Full Case Preview 构建

**是的**——完整演示 = `threejs-case/01-dracarys` 执行 `npm run build` 后的 **`dist/` 构建产物**，复制到本仓库，**不**迁入 TS 源码、也不在主应用内编译 Three.js。

```
threejs-case/01-dracarys/
  npm run build  →  dist/
                      ↓ 复制
math-journey/public/cases/dracarys/    ← index.html + assets/
math-journey/public/gl|audio|three/    ← npm run cases:sync-dracarys（根路径资源）
```

主应用通过 iframe 加载 `public/cases/dracarys/index.html`；Dracarys 内硬编码 `/gl/`、`/audio/`、`/three/` 绝对路径，故需 sync 到 `public/` 根目录。

更新 Dracarys 后：`build` → 覆盖 `public/cases/dracarys/` → `npm run cases:sync-dracarys`。

## 案例知识点与课程分布

案例专属知识点除 `public/learn-*.html`（知识库深读）外，须在 **Stage 1–7** 有对应可编辑课程（按数学主题归档，非单独阶段）。Case `meta.learningPath` 定义跨阶段预习顺序；Case Step 的 `prerequisites` 引用 `lesson id`。

## Dracarys 步骤规划

Case Step 的目标是复刻完整案例中的子系统切片，而不是只抽象数学原理。能在单屏 fragment 中一比一表达的步骤可保留 `runtime: 'fragment'`；依赖真实状态管线、FBO、粒子几何或 Three.js 材质挂载的步骤必须使用 `runtime: 'three'`，并通过 `previewKind` 指定迷你运行时。

当前已落地的 Three 切片：

| id | runtime | previewKind | 真实案例对应 |
|----|---------|-------------|--------------|
| `dracarys-01-intro-mask` | `three` | `texture-fragment` | 真实封面 `/cases/dracarys/images/share.jpg` + Master mask progress |
| `dracarys-03-water` | `three` | `water-sim` | `WaterSimulation` + `WATER_SIM_FRAGMENT` ping-pong 高度纹理 |
| `dracarys-05-gpgpu-particles` | `three` | `model-particles` | `/gl/models/dragon-fly-flames-bb.glb` + `DragonParticleMesh` 渲染 shader |

| order | id | 标题 | runtime | 练习焦点 | 待补知识点 |
|-------|-----|------|---------|----------|------------|
| 1 | `dracarys-01-intro-mask` | 封面遮罩 | three | 真实封面贴图 + progress remap | 值域映射 |
| 2 | `dracarys-02-ndc-mouse` | 鼠标与 NDC | fragment | 屏幕坐标 → NDC | `ndc-coords` |
| 3 | `dracarys-03-water` | 水面波动 | three | FBO ping-pong 高度场 | `texture-sample`, `wave-equation` |
| 4 | `dracarys-04-water-reflect` | 水面反射 | fragment | 法线扰动 + 反射 UV | `normal-map` |
| 5 | `dracarys-05-gpgpu-particles` | 模型粒子 | three | 真实 GLB 点云 + 粒子颜色混合 | `gpgpu-particles` |
| 6 | `dracarys-06-flame` | 火焰粒子 | fragment | 生命周期 + 发射 | `particle-life` |
| 7 | `dracarys-07-post-master` | 后处理 | fragment | barrel + screen blend | `barrel-distortion`, `blend-screen` |
| 8 | `dracarys-08-atmosphere` | 环境氛围 | fragment | 噪声 + 距离衰减 | `noise-texture` |

> **注：** 步骤 4、6、7、8 仍有不同程度的 fragment 近似。后续迁移应优先按完整案例源码模块还原：`WATER_REFLECTOR_FRAGMENT`、`FLAME_VERTEX` / `FLAME_FRAGMENT`、`MasterShader`、`RAYS_FRAGMENT` / `FOG_FRAGMENT`，并尽量使用 `public/gl/images/` 中的真实贴图。

## 索引注册

Case Step 必须出现在 `src/cases/<slug>/index.js` 及 `src/cases/index.js`，否则不会加载。

## 相关文档

- [ARCHITECTURE.md](../ARCHITECTURE.md) — 双轨组件图
- [lesson-schema.md](./lesson-schema.md) — Lesson 轨（不变）
- [knowledge-system.md](./knowledge-system.md) — 知识点注册
