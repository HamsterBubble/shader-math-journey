# 课程文件夹 + Vite ?raw 静态打包

每节课是 `src/lessons/stageN/XX-slug/` 下的 `meta.js` + HTML + GLSL 文件，经 `stageN/index.js` 用 `?raw` 导入为字符串，构建期打入 bundle。未采用运行时 fetch 或 CMS，因为课程是核心资产、需版本控制与离线可用，且 99 课体量对 bundle 可接受。新增课必须手动更新 `stageN/index.js`（文件头虽写 Auto-generated，仓库内暂无 regen 脚本）。

**Considered Options:** 运行时 JSON API 拉取课程（需后端）；Markdown + frontmatter（不利于 GLSL 高亮与 Monaco 编辑体验）。

**Consequences:** 增删课需改 JS import 列表；`npm run docs:curriculum` 可同步索引但不可替代 index 维护。
