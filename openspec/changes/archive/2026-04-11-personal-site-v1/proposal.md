## Why

作为独立开发者，需要一个专业的线上展示页面来呈现个人项目作品和技术能力，让产品经理和技术同行快速了解我的技能与经验，从而促成合作机会。当前没有任何线上展示，需要从零搭建。

## What Changes

- 新建 React 19 + Vite 7 + TypeScript + Tailwind CSS v4 项目脚手架
- 实现 Hero 区块：包含 2D Canvas 粒子背景动画、姓名、一句话定位、CTA 按钮
- 实现「关于我」区块：自我介绍文案 + 技术栈标签展示
- 实现「项目展示」区块：响应式卡片网格，展示项目截图、名称、描述、技术标签，支持 hover 微动效
- 实现亮/暗主题切换功能，青绿色系配色方案
- 实现固定导航栏，含主题切换按钮
- 实现 Footer 区域，包含占位联系邮箱
- 配置 GitHub Pages 部署，base path 为 `/my-website/`

## Capabilities

### New Capabilities

- `hero-section`: Hero 区块的视觉呈现、2D Canvas 粒子动画、CTA 交互
- `about-section`: 关于我区块的内容展示与技术栈标签
- `project-showcase`: 项目展示区块的卡片网格布局、数据源、hover 动效
- `theme-switcher`: 亮/暗主题切换功能，青绿色系配色方案
- `site-shell`: 站点整体框架（导航栏、Footer、页面布局、响应式适配）

### Modified Capabilities

（无，全新项目）

## Impact

- **代码库**: 全新项目，从零创建，无现有代码受影响
- **依赖**: React 19, Vite 7, TypeScript, Tailwind CSS v4
- **部署**: GitHub Pages，需配置 `/my-website/` base path，使用 `gh-pages` 或 GitHub Actions 部署
- **性能**: 2D Canvas 粒子动画需控制性能开销，首屏加载目标 < 2 秒；移动端可考虑降低粒子数量或关闭动画

## Out of Scope

- 博客/文章系统
- 联系表单（仅展示占位邮箱）
- 国际化（i18n）
- 后台管理 / CMS
- SEO 优化（后续迭代）
- 真实项目数据（先用硬编码占位）
- 3D 动画或 Three.js
- 后端 API 或数据库
