# 前端路由与页面结构

## 依赖

- react-router v7 (路由)
- react-markdown + remark (Markdown 渲染，学习页用)

## 路由表

```
┌─────────────────────── 路由表 ──────────────────────────────┐
│                                                              │
│  公开页面（SiteLayout，无需认证）                              │
│  ├ /                    → 品牌主页（Hero+About+Projects）     │
│  └ (未来扩展: /about, /blog ...)                             │
│                                                              │
│  认证页面（独立，无 Layout 壳）                                │
│  ├ /login               → 登录                               │
│  └ /register            → 注册                               │
│                                                              │
│  Dashboard（AppLayout，需认证，未登录跳转 /login）            │
│  ├ /dashboard           → 学习概览（进度统计/推荐课程）       │
│  ├ /dashboard/courses   → 课程列表                           │
│  ├ /dashboard/courses/:id → 课程详情（课时目录）             │
│  ├ /dashboard/learn/:id → 学习页（内容 + AI 对话）           │
│  └ /dashboard/profile   → 个人设置                           │
│                                                              │
│  Admin（AdminLayout，需 admin 角色）                          │
│  ├ /admin/courses        → 课程管理 CRUD                     │
│  ├ /admin/courses/:id/lessons → 课时管理                     │
│  ├ /admin/users          → 用户管理                          │
│  └ /admin/stats          → 数据统计                          │
│                                                              │
│  404                                                        │
│  └ *                    → NotFound                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 布局结构

```
  品牌站路由 (/)                    Dashboard 路由 (/dashboard/*)
  ┌──────────────────┐              ┌──────────────────────────────┐
│   SiteLayout     │              │   AppLayout                  │
│  ┌────────────┐  │              │  ┌───────┬──────────────────┐│
│  │  Navbar    │  │              │  │       │  TopBar          ││
│  ├────────────┤  │              │  │ Side  ├──────────────────┤│
│  │            │  │              │  │ bar   │  <Outlet />      ││
│  │  <Outlet/> │  │              │  │       │  (页面内容)       ││
│  │            │  │              │  │       │                  ││
│  ├────────────┤  │              │  │       │                  ││
│  │  Footer    │  │              │  │       │                  ││
│  └────────────┘  │              │  └───────┴──────────────────┘│
│  └──────────────────┘              └──────────────────────────────┘

  Admin 路由 (/admin/*)
  ┌──────────────────────────────┐
│   AdminLayout                 │
│  ┌───────┬──────────────────┐│
│  │       │  TopBar          ││
│  │ Admin ├──────────────────┤│
│  │ Side  │  <Outlet />      ││
│  │ bar   │  (管理页面)       ││
│  │       │                  ││
│  └───────┴──────────────────┘│
│  └──────────────────────────────┘
```

## 目录结构

```
src/
├── App.tsx                    ← BrowserRouter + Routes 壳
├── main.tsx
├── index.css
├── types/
├── hooks/
│   ├── useTheme.tsx           ← 保留
│   ├── useParticles.ts        ← 保留
│   ├── useAuth.tsx            ← 新增：认证状态 Context
│   └── useChat.ts             ← 新增：SSE 流式对话 Hook
├── data/                      ← 品牌站静态数据保留
│
├── layouts/                   ← 新增
│   ├── SiteLayout.tsx         ← 品牌站布局：Navbar + Footer
│   ├── AppLayout.tsx          ← Dashboard 布局：侧边栏 + 顶栏
│   └── AdminLayout.tsx        ← 管理后台布局
│
├── pages/                     ← 新增：按路由组织页面
│   ├── HomePage.tsx           ← 组合 Hero/About/Projects
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── NotFound.tsx
│   ├── dashboard/
│   │   ├── DashboardPage.tsx
│   │   ├── CoursesPage.tsx
│   │   ├── CourseDetailPage.tsx
│   │   ├── LearnPage.tsx
│   │   └── ProfilePage.tsx
│   └── admin/
│       ├── CoursesAdmin.tsx
│       ├── LessonEditor.tsx
│       ├── UsersAdmin.tsx
│       └── StatsPage.tsx
│
├── components/                ← 重组
│   ├── ui/                    ← 通用 UI（Button, Card, Modal...）
│   ├── layout/
│   │   ├── Navbar.tsx         ← 品牌站导航（保留）
│   │   ├── Footer.tsx         ← 保留
│   │   └── Sidebar.tsx        ← 新增：Dashboard 侧边栏
│   ├── hero/                  ← 保留
│   ├── about/                 ← 保留
│   ├── projects/              ← 保留
│   ├── chat/                  ← 新增
│   │   ├── ChatPanel.tsx
│   │   └── ChatMessage.tsx
│   └── course/                ← 新增
│       ├── CourseCard.tsx
│       └── ProgressBar.tsx
│
└── services/                  ← 新增：API 调用层
    ├── api.ts                 ← fetch 封装 + JWT 注入
    ├── auth.ts                ← 登录/注册/token 管理
    └── courses.ts             ← 课程相关 API
```

## 文件变更范围

### 保持不变

- `src/hooks/useTheme.tsx`
- `src/hooks/useParticles.ts`
- `src/components/hero/` (HeroSection, ParticleCanvas)
- `src/components/about/AboutSection.tsx`
- `src/components/projects/` (ProjectShowcase, ProjectCard)
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/index.css`
- `index.html`

### 需要修改

- `src/App.tsx` — 单页堆叠 → 路由壳
- `src/main.tsx` — 包裹 BrowserRouter
- `vite.config.ts` — 添加 API proxy
- `package.json` — 新依赖

### 全部新增

- `src/layouts/` (3 个布局组件)
- `src/pages/` (10+ 页面组件)
- `src/services/` (API 调用层)
- `src/hooks/useAuth.tsx`, `src/hooks/useChat.ts`
- `src/components/ui/`, `src/components/chat/`, `src/components/course/`
