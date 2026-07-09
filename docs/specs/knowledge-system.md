# Knowledge System

跨课程知识点注册、自动链接注入与 UI 展示。

## 组件

| 部分 | 路径 | 职责 |
|------|------|------|
| 注册表 | `src/config/knowledge.js` | `KNOWLEDGE_POINTS` 数组 |
| 静态页 | `public/learn-*.html` | iframe 加载的知识点内容 |
| 补充说明 | `public/explain-lesson*.html` | 部分课的扩展说明（非注册表驱动） |
| 注入脚本 | `scripts/inject-knowledge-links.mjs` | 扫描 code.glsl → 写入 instructions.html |
| 列表面板 | `src/components/KnowledgePanel.jsx` | 右侧知识库列表 + iframe 详情 |
| 链接点击 | `src/components/InstructionPanel.jsx` | 事件委托 `.knowledge-link` |

## KNOWLEDGE_POINTS 条目结构

```js
{
  id: 'uv-remap',              // 唯一标识
  page: '/learn-uv-remap.html', // public/ 下的路径
  title: '坐标居中：uv × 2 − 1',
  label: '坐标居中原理',        // 链接按钮文字
  icon: '📐',
  patterns: ['uv * 2.0 - 1.0', 'uv-0.5'],  // code.glsl 子串匹配
}
```

## 注入脚本行为

`node scripts/inject-knowledge-links.mjs`

1. 遍历 `src/lessons/stage*/**/code.glsl`
2. 对每个 Knowledge Point，若 `patterns` 任一匹配则生成链接
3. `SKIP_MAP` 跳过「教该概念的课」避免自引用
4. 在 `instructions.html` 第一个 `</h2>` 后插入/替换 `<p class="knowledge-tags">`

## 交互流

```
用户点击 .knowledge-link
  → InstructionPanel handleClick
    → App.handleOpenKnowledge({ src: page, title })
      → KnowledgePanel iframe 显示
```

列表视图直接点击 `KNOWLEDGE_POINTS` 项同样打开 iframe。

## 新增知识点

1. 在 `public/` 创建 `learn-xxx.html`
2. 在 `knowledge.js` 添加条目（id、page、patterns 等）
3. 在 `inject-knowledge-links.mjs` 的 `SKIP_MAP` 添加教授该概念的课路径
4. 运行注入脚本

## 注意

- `explain-lesson*.html` 不在 `KNOWLEDGE_POINTS` 中，需手动链入 instructions
- Knowledge Panel 宽度存于 `localStorage.knowledgePanelWidth`
- Knowledge Panel 展开状态存于 `localStorage.knowledgePanelOpen`；工具栏「知识库」按钮切换显隐（带宽度过渡动画）；点击知识点链接时若已折叠会自动展开
