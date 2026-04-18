# 系统架构总览

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React + TypeScript | 19.2 / 6.0 |
| 构建工具 | Vite + Tailwind CSS | 8.0 / 4.2 |
| 前端路由 | react-router | v7 |
| 后端框架 | FastAPI (Python) | - |
| 数据库 | SQLite + SQLAlchemy + Alembic | - |
| 认证 | JWT + bcrypt | - |
| AI | LLM API (OpenAI / Claude) | - |

## 整体架构

```
┌═══════════════════════════════════════════════════════════════════════┐
│                          系统全景                                      │
│                                                                        │
│  ┌──────────────── 前端 (my_website) ────────────────────────────────┐ │
│  │                                                                    │ │
│  │  ┌─── 公开区域 ───────────────────────────────────────────────┐   │ │
│  │  │                                                            │   │ │
│  │  │  /                      品牌主页 (SiteLayout)               │   │ │
│  │  │  ├─ Navbar  Hero  About  Projects  Footer                  │   │ │
│  │  │  └─ 纯静态，不调用后端 API                                  │   │ │
│  │  │                                                            │   │ │
│  │  │  /login                   全屏登录页                        │   │ │
│  │  │  /register                全屏注册页                        │   │ │
│  │  │  └─ 复用品牌站主题，但独立布局无 Navbar/Footer              │   │ │
│  │  └────────────────────────────────────────────────────────────┘   │ │
│  │                              │                                     │ │
│  │                     认证成功后跳转                                   │ │
│  │                              ▼                                     │ │
│  │  ┌─── 认证区域 (AppLayout) ───────────────────────────────────┐   │ │
│  │  │                                                            │   │ │
│  │  │  /dashboard              学习概览                           │   │ │
│  │  │  /dashboard/courses       课程列表                          │   │ │
│  │  │  /dashboard/courses/:id   课程详情                          │   │ │
│  │  │  /dashboard/learn/:id     学习页（内容 + AI 对话）           │   │ │
│  │  │  /dashboard/profile       个人设置                          │   │ │
│  │  │  /admin/*                 管理后台 (admin 角色)              │   │ │
│  │  │                                                            │   │ │
│  │  └────────────────────────────────────────────────────────────┘   │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                              │                                         │
│              HTTPS / fetch + Bearer JWT + SSE                          │
│                              │                                         │
│  ┌──────────────── 后端 (my_website_api) ───────────────────────────┐  │
│  │                                                                    │  │
│  │  FastAPI                                                           │  │
│  │  ├─ /api/auth/*         认证  (JWT + bcrypt)                      │  │
│  │  ├─ /api/courses/*      课程 CRUD + 注册课程列表                   │  │
│  │  ├─ /api/lessons/*      课时 CRUD                                 │  │
│  │  ├─ /api/progress/*     学习进度                                  │  │
│  │  ├─ /api/ai/*           AI 服务 (LLM 对话 + 练习生成)             │  │
│  │  └─ /api/admin/*        管理接口 (role=admin)                     │  │
│  │                                                                    │  │
│  │  SQLite ──── 文件数据库                                            │  │
│  │  Alembic ──── 版本迁移                                             │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                              │                                         │
│                     LLM API (OpenAI / Claude)                           │
│                                                                        │
└═════════════════════════════════════════════════════════════════════════┘
```

## 部署方案

- **前端**：独立仓库 `my_website`，静态托管 (Vercel / Cloudflare Pages)
- **后端**：独立仓库 `my_website_api`，VPS / Fly.io / Railway
- **前后端分离**，通过 HTTPS + CORS 通信

## 关键决策记录

| 决策点 | 结论 |
|--------|------|
| 前端路由 | react-router v7，三套 Layout（Site / App / Admin） |
| 后端框架 | FastAPI + SQLite + Alembic |
| 认证方式 | JWT + bcrypt，全屏登录/注册页 |
| AI 功能 | LLM 对话辅导 + 练习题生成，SSE 流式响应 |
| 内容管理 | Admin 面板，Markdown 编辑器 + AI Prompt 配置 |
| 品牌主页 | 保留不动，纯静态，不调用后端 API |
