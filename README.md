# Shader Math Journey

一个交互式 Shader 数学学习平台，通过循序渐进的课程体系，帮助你掌握 GPU 着色器编程中的核心数学概念。

## ✨ 特性

- 📚 **分阶段课程体系** — 从基础代数函数到高级程序化噪声与光线行进，覆盖 Shader 开发全路径
- 🎨 **实时预览** — 内置 WebGL Canvas，即时查看 GLSL 代码的运行效果
- ✏️ **交互式编辑器** — 基于 Monaco Editor，提供代码高亮和编辑体验
- 🧩 **骨架代码 + 目标预览** — 每节课提供可编辑的骨架代码与目标效果对比，引导自主学习

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器打开 `http://localhost:5173` 即可访问。

### 构建生产版本

```bash
npm run build
npm run preview
```

## 🛠️ 技术栈

- **框架**: React 19 + Vite 8
- **编辑器**: Monaco Editor
- **渲染**: WebGL / GLSL
- **语言**: JavaScript (ESM)

## 📁 项目结构

```
shader-math-journey/
├── index.html            # 入口 HTML
├── src/
│   ├── main.jsx          # 应用入口
│   ├── App.jsx           # 主应用组件
│   ├── style.css         # 全局样式
│   ├── components/       # UI 组件（工具栏、侧边栏、预览画布等）
│   ├── core/             # 核心逻辑（WebGL 渲染引擎等）
│   ├── hooks/            # 自定义 React Hooks
│   └── lessons/          # 课程内容（指令 + GLSL 着色器）
├── vite.config.js        # Vite 配置
└── package.json
```

## 📄 License

MIT
