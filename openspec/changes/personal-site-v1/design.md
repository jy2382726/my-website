## Context

全新项目，无现有代码。需要从零搭建一个个人品牌展示站，目标用户是产品经理和技术同行。项目使用 React 19 + Vite 7 + TypeScript + Tailwind CSS v4 技术栈，部署到 GitHub Pages（base path `/my-website/`）。

约束：
- 首屏加载 < 2 秒
- 纯前端静态站，无后端
- 支持 SEO 友好的单页应用（后续可扩展）

## Goals / Non-Goals

**Goals:**
- 建立清晰的项目结构，便于后续迭代（添加博客、更多页面等）
- 实现高性能的 2D Canvas 粒子动画，不影响首屏加载速度
- 提供流畅的亮/暗主题切换体验
- 响应式设计，适配桌面端和移动端
- 代码结构清晰，组件职责单一

**Non-Goals:**
- 不实现任何后端逻辑或数据库
- 不实现 CMS 或内容管理
- 不做 SSR/SSG（纯客户端渲染即可）
- 不做国际化
- 不做 PWA

## Decisions

### D1: 项目结构采用功能模块分组

```
src/
├── components/
│   ├── layout/        # Navbar, Footer
│   ├── hero/          # HeroSection, ParticleCanvas
│   ├── about/         # AboutSection, TechTags
│   └── projects/      # ProjectShowcase, ProjectCard
├── data/              # projects.ts（硬编码数据）
├── hooks/             # useTheme, useParticles
├── types/             # TypeScript 类型定义
└── App.tsx
```

**理由**：按功能模块分组比按类型分组更直观，适合小中型项目。每个模块内聚，便于定位和修改。

### D2: 粒子动画使用原生 Canvas API + requestAnimationFrame

**选择**: 原生 2D Canvas + rAF
**备选**: tsparticles 库、three.js
**理由**: 原生实现体积最小（0 依赖），性能可控，2D 粒子效果足够。tsparticles 功能多但体积大（~50KB），three.js 对 2D 粒子过重。

**实现要点**：
- 粒子数量：桌面端 ~80，移动端 ~30
- 粒子行为：缓慢飘动 + 连线（距离 < 阈值时画线）
- 颜色：跟随主题 accent 色，降低透明度
- 性能：使用 `IntersectionObserver` 检测 Hero 是否在视口内，不在视口时暂停动画

### D3: 主题切换使用 CSS 变量 + Tailwind dark mode（class 策略）

**选择**: `darkMode: 'class'` + CSS 变量
**备选**: 仅用 Tailwind `dark:` 前缀、CSS-in-JS
**理由**:
- `class` 策略允许动态切换，`media` 策略只能跟随系统
- CSS 变量用于粒子颜色等 Canvas 动态读取的场景
- Tailwind `dark:` 前缀处理组件样式
- 主题偏好存入 `localStorage`，首次访问跟随系统偏好

### D4: 项目数据硬编码为 TypeScript 文件

**选择**: `src/data/projects.ts` 导出类型化数组
**备选**: JSON 文件、Markdown + 解析、外部 API
**理由**: 最简单直接，类型安全，无需额外工具链。后续如需 CMS 可以替换数据源而不改组件。

### D5: 部署使用 Vite 的 base 配置 + gh-pages 包

**选择**: `vite.config.ts` 设置 `base: '/my-website/'`，使用 `gh-pages` npm 包部署
**备选**: GitHub Actions、手动部署
**理由**: `gh-pages` 包最简单，一条命令部署。后续可迁移到 GitHub Actions。

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| Canvas 粒子影响首屏加载 | 中 | 粒子动画异步初始化，不阻塞内容渲染；Hero 文本内容优先显示 |
| 移动端性能问题 | 低 | 移动端减少粒子数量，低端设备可跳过动画 |
| Tailwind CSS v4 较新，文档可能不全 | 低 | 使用 Context7 查询最新文档，必要时降级到 v3 |
| 硬编码数据难以维护 | 低 | 数据量小（~10 个项目），手动维护可接受；接口已预留类型定义 |
