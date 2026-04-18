## Context

当前项目是纯前端 React SPA（Vite + Tailwind v4），无路由、无后端、无用户系统。
本设计将其扩展为前后端分离的全栈 AI 学习平台。前端引入 react-router v7 改造为多页面应用，
后端使用 FastAPI + SQLite 构建独立 API 服务，通过 JWT 认证通信。

约束：复用已有组件，品牌主页功能不变，后端代码置于 `server/` 子目录（monorepo 结构）。

## Goals / Non-Goals

**Goals:**
- 将 SPA 改造为多页面路由应用，品牌主页、Dashboard、Admin 三套布局独立运行
- 搭建 FastAPI 后端，提供用户认证、课程管理、学习进度、AI 辅导的完整 API
- 实现核心学习体验：Markdown 内容渲染 + AI 对话辅导（SSE 流式）+ 练习题生成
- 本地开发环境前后端联调可用

**Non-Goals:**
- 生产部署配置（CI/CD、域名、SSL）
- SEO / SSR / SSG
- 国际化
- OAuth 第三方登录
- 支付系统
- 移动端 App
- 在线代码运行环境

## Decisions

### D1: 路由方案 — react-router v7

选择 react-router v7 而非 TanStack Router。
React 生态最广泛的路由方案，社区资源丰富，学习成本低。
TanStack Router 的类型安全路由优势在独立后端（方案 B）架构下收益有限。

> **Implementation Note**: Vite 配置 `base: '/my-website/'` 要求 `<BrowserRouter basename="/my-website">`。

### D2: 前端布局架构 — 三套独立 Layout

```
App.tsx (BrowserRouter)
├── SiteLayout          /                       公开，无需认证
│   ├── Navbar
│   ├── <Outlet />      HomePage
│   └── Footer
├── (无 Layout)         /login, /register       独立全屏页
├── AppLayout           /dashboard/*            需认证
│   ├── Sidebar
│   ├── TopBar
│   └── <Outlet />      Dashboard/Courses/Learn/Profile
└── AdminLayout         /admin/*                需 admin 角色
    ├── AdminSidebar
    ├── TopBar
    └── <Outlet />      CoursesAdmin/LessonEditor/UsersAdmin/Stats
```

路由守卫通过 Layout 层的 `useAuth` 检查实现，未认证跳转 `/login`，
非 admin 角色访问 `/admin/*` 返回 403 页面。

### D3: 后端框架 — FastAPI + SQLite

FastAPI 原生 async + Pydantic 类型验证，开发效率高。
SQLite 零配置，个人项目起步无需外部数据库服务。
Alembic 管理数据库迁移，后续迁移到 PostgreSQL 时只需改连接字符串。

### D3.1: Python 环境管理 — uv

使用 uv 管理后端项目的 Python 版本、虚拟环境和依赖。
uv 替代传统的 venv + pip，提供更快的依赖解析和锁定（uv.lock）。
所有后端命令 SHALL 通过 uv 执行：
- `uv init` 初始化项目
- `uv add <package>` 添加依赖
- `uv run uvicorn` 启动服务
- `uv run alembic` 执行迁移

### D4: 认证方案 — JWT + bcrypt

- 注册：bcrypt 哈希密码存储
- 登录：PyJWT 签发 access_token
- 前端存储：localStorage
- 请求传输：`Authorization: Bearer <token>`
- FastAPI 通过 `Depends(get_current_user)` 依赖注入验证

Token 有效期建议 24 小时。本阶段不做 refresh token（out-of-scope）。

### D5: 前后端通信 — REST + SSE

- 普通 API：REST JSON（fetch + Bearer token）
- AI 对话：SSE（Server-Sent Events），FastAPI StreamingResponse
- 前端通过 `fetch` + `ReadableStream` 消费 SSE 流

### D5.1: LLM 服务 — DashScope (阿里云)

使用 DashScope API 作为 LLM 提供商，通过 OpenAI 兼容接口调用。
当前模型：`qwen3.5-plus`（思考模型，SSE 流中先输出 `reasoning_content` 后输出 `content`）。
后端仅提取 `content` 部分返回前端。

配置位于 `server/.env`：
- `LLM_API_BASE=https://dashscope.aliyuncs.com/compatible-mode/v1`
- `LLM_MODEL=qwen3.5-plus`
- `LLM_API_KEY=<key>`

### D6: 数据库 Schema — 6 张表

```
users          用户（email, hashed_pw, role）
courses        课程（title, description, category, difficulty, is_published）
lessons        课时（course_id, title, content, order, lesson_type, ai_prompt）
enrollments    注册关系（user_id, course_id）
progress       学习进度（user_id, lesson_id, status, notes）
chat_messages  对话历史（user_id, lesson_id, role, content）
```

关系链：User → Enrollment → Course → Lesson → Progress / ChatMessage

### D7: 组件复用策略

已有组件全部保留，不修改内部实现：
- `ThemeProvider` / `useTheme` → 全局复用（已包裹在 App 最外层）
- `Navbar` / `Footer` → SiteLayout 专用
- `HeroSection` / `AboutSection` / `ProjectShowcase` → HomePage 专用
- `ParticleCanvas` / `useParticles` → HeroSection 专用

新增组件按职责归入新目录：
- `src/components/ui/` → 通用 UI（Button, Card, Modal）
- `src/components/chat/` → AI 对话相关
- `src/components/course/` → 课程展示相关

## API 端点规范

### 认证 `/api/auth`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/register` | 注册新用户 | 无 |
| POST | `/api/auth/login` | 登录，返回 JWT | 无 |
| GET | `/api/auth/me` | 获取当前用户信息 | Bearer |
| PUT | `/api/auth/me` | 更新个人信息（display_name） | Bearer |
| PUT | `/api/auth/me/password` | 修改密码 | Bearer |

### 课程 `/api/courses`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/courses` | 课程列表（支持分类/难度筛选） | Bearer |
| GET | `/api/courses/enrollments/list` | 当前用户注册的课程列表 | Bearer |
| GET | `/api/courses/:id` | 课程详情 + 课时目录 | Bearer |
| POST | `/api/courses/:id/enroll` | 注册课程 | Bearer |

### 课时 `/api/lessons`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/lessons/:id` | 课时内容 (Markdown) | Bearer |

### 学习进度 `/api/progress`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/progress` | 当前用户所有进度 | Bearer |
| GET | `/api/progress/course/:id` | 某课程的进度 | Bearer |
| PUT | `/api/progress/:id` | 更新进度状态 | Bearer |

### AI 服务 `/api/ai`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/ai/chat` | AI 对话 (SSE 流式响应) | Bearer |
| POST | `/api/ai/exercise` | 生成练习题 | Bearer |

### 管理后台 `/api/admin` (role=admin)

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/admin/courses` | 所有课程（含未发布） | Admin |
| POST | `/api/admin/courses` | 创建课程 | Admin |
| PUT | `/api/admin/courses/:id` | 更新课程 | Admin |
| DELETE | `/api/admin/courses/:id` | 删除课程 | Admin |
| GET | `/api/admin/courses/:id/lessons` | 课时列表 | Admin |
| POST | `/api/admin/courses/:id/lessons` | 创建课时 | Admin |
| PUT | `/api/admin/lessons/:id` | 更新课时 | Admin |
| DELETE | `/api/admin/lessons/:id` | 删除课时 | Admin |
| GET | `/api/admin/users` | 用户列表 | Admin |
| PUT | `/api/admin/users/:id/role` | 修改用户角色 | Admin |
| GET | `/api/admin/stats` | 平台统计数据 | Admin |

## Risks / Trade-offs

| 风险 | 等级 | 缓解措施 |
|------|------|----------|
| 路由改造破坏品牌主页 | 中 | 品牌主页组件零修改，仅重组到 HomePage + SiteLayout；路由为纯增量 |
| JWT 存 localStorage 有 XSS 风险 | 低 | 本阶段仅本地开发，非生产环境；后续可迁移到 HttpOnly Cookie |
| SQLite 并发写入限制 | 低 | 个人项目，单用户场景，不存在并发瓶颈 |
| LLM API 成本/延迟 | 中 | AI 对话可配置模型；SSE 流式响应改善体感延迟；可做用量限制 |
| 前后端类型手动同步可能不一致 | 低 | 项目初期类型少，手动同步可控；后期引入 OpenAPI 代码生成 |
| 后端独立仓库开发体验分散 | 低 | Vite proxy 联调；两套 dev server 统一启动脚本 |

## Known Issues (2026-04-18 E2E Test)

| Bug | 文件 | 描述 | 状态 |
|-----|------|------|------|
| BUG-1 | `src/services/api.ts:17-21` | 401 拦截器无法区分 token 过期与业务逻辑 401，导致修改密码时旧密码错误被踢到登录页 | Fixed |
| BUG-2 | `src/layouts/AppLayout.tsx:34` | 退出按钮 `window.location.href = '/login'` 未适配 basename `/my-website`，点击退出后跳 404 | Fixed |
| BUG-3 | `server/app/routers/ai.py:49` | AI 消息 role 映射 `"ai"` → `"assistant"` | Fixed |
