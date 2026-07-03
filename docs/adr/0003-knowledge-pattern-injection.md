# 知识点注册表 + 模式匹配自动注入

跨课复用概念通过 `src/config/knowledge.js` 集中注册，用 `scripts/inject-knowledge-links.mjs` 扫描 `code.glsl` 中的 `patterns` 子串，自动向 `instructions.html` 插入 `.knowledge-link` 标签。未采用在每课 HTML 手写全部链接，因为 99 课维护成本高且易遗漏；未采用 AST 级 GLSL 解析，因为子串匹配对教学场景足够且零依赖。`SKIP_MAP` 防止在「教该概念」的课中注入自引用链接。

**Considered Options:** 纯手工维护链接；构建时 GLSL parser 精确匹配函数调用。

**Consequences:** 模式过宽可能误匹配；新增知识点需同时改 `knowledge.js`、创建 `public/learn-*.html`、更新 `SKIP_MAP` 并跑注入脚本。
