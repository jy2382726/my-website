## Phase 1: 项目脚手架与基础配置

- [x] 1.1 使用 Vite 创建 React 19 + TypeScript 项目，初始化 package.json
- [x] 1.2 安装并配置 Tailwind CSS v4（含 dark mode class 策略）
- [x] 1.3 配置 vite.config.ts（base path: `/my-website/`、构建优化）
- [x] 1.4 定义 CSS 变量配色方案（亮/暗两套 teal 色系）和全局样式
- [x] 1.5 创建项目目录结构（components/layout, hero, about, projects, data, hooks, types）

## Phase 2: 站点框架与主题系统

- [x] 2.1 实现 ThemeProvider 组件和 useTheme hook（localStorage 持久化 + 系统偏好检测）
- [x] 2.2 实现 Navbar 组件（固定顶部、站点名称、导航链接、主题切换按钮、滚动时背景模糊）
- [x] 2.3 实现 Footer 组件（占位邮箱 mailto 链接）
- [x] 2.4 组装 App.tsx 主页面结构（Navbar → Hero → About → Projects → Footer）

**Phase 2 完成后确认点：** 导航栏固定展示，主题可切换且持久化，Footer 可见

## Phase 3: Hero 区块与粒子动画

- [x] 3.1 定义类型文件（types/index.ts：Theme、Project 等类型）
- [x] 3.2 实现 ParticleCanvas 组件（2D Canvas + rAF 动画循环、粒子飘动 + 连线、响应式数量）
- [x] 3.3 实现 useParticles hook（IntersectionObserver 视口检测、主题色联动）
- [x] 3.4 实现 HeroSection 组件（姓名、定位语、CTA 按钮、Canvas 背景叠加）
- [x] 3.5 实现 CTA 按钮交互（「联系我」mailto 跳转、「查看项目」平滑滚动锚点）

**Phase 3 完成后确认点：** 粒子动画流畅运行，离开视口暂停，CTA 按钮可点击

## Phase 4: 关于我与项目展示

- [x] 4.1 创建数据文件（data/about.ts：自我介绍文案 + 技术栈列表）
- [x] 4.2 实现 AboutSection 组件（介绍文案 + 技术栈标签/chip）
- [x] 4.3 创建项目数据文件（data/projects.ts：名称、描述、技术标签、截图路径、链接）
- [x] 4.4 实现 ProjectCard 组件（截图、名称、描述、技术标签、hover 动效）
- [x] 4.5 实现 ProjectShowcase 组件（响应式网格布局 + 空状态处理 + 图片懒加载）

**Phase 4 完成后确认点：** 关于我正常展示，项目卡片网格响应式适配，hover 效果流畅

## Phase 5: 响应式适配与收尾

- [x] 5.1 移动端全面适配测试（导航栏、Hero、卡片网格、Footer）
- [x] 5.2 主题切换在所有区块中表现一致（含粒子颜色联动）
- [x] 5.3 性能检查（首屏加载时间、粒子帧率、图片懒加载生效）
- [x] 5.4 配置 GitHub Pages 部署脚本（gh-pages 包）
