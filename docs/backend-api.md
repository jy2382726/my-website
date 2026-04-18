# 后端 API 架构

## 技术栈

- **环境管理**: uv（Python 包管理、虚拟环境、版本锁定）
- **框架**: FastAPI (Python)
- **ORM**: SQLAlchemy / SQLModel
- **数据库**: SQLite
- **迁移**: Alembic
- **认证**: PyJWT + bcrypt + python-multipart

## 仓库结构

```
my_website_api/                  ← 独立仓库
├── app/
│   ├── __init__.py
│   ├── main.py                 ← FastAPI 入口，挂载路由 + 中间件
│   ├── config.py               ← 环境变量 / Settings
│   ├── database.py             ← SQLite 连接 + session 管理
│   │
│   ├── models/                 ← SQLAlchemy 模型
│   │   ├── user.py
│   │   ├── course.py
│   │   ├── lesson.py
│   │   ├── enrollment.py
│   │   ├── progress.py
│   │   └── chat_message.py
│   │
│   ├── schemas/                ← Pydantic 请求/响应 schema
│   │   ├── auth.py
│   │   ├── course.py
│   │   ├── lesson.py
│   │   ├── progress.py
│   │   └── chat.py
│   │
│   ├── routers/                ← API 路由
│   │   ├── auth.py             ← /api/auth/* (register, login, me, password)
│   │   ├── courses.py          ← /api/courses, /api/courses/enrollments/list
│   │   ├── lessons.py          ← /api/courses/{id}/lessons
│   │   ├── progress.py         ← /api/progress
│   │   ├── ai.py               ← /api/ai/chat, /api/ai/exercise
│   │   └── admin.py            ← /api/admin/* (role=admin)
│   │
│   ├── services/               ← 业务逻辑
│   │   ├── auth_service.py
│   │   └── ai_service.py       ← 调用 LLM 的封装
│   │
│   ├── middleware/
│   │   ├── auth.py             ← JWT 验证依赖
│   │   ├── cors.py             ← CORS 配置
│   │   └── error_handler.py
│   │
│   └── utils/
│       └── security.py         ← 密码哈希 + JWT 工具
│
├── migrations/                 ← Alembic 数据库迁移
│   └── ...
├── alembic.ini
├── pyproject.toml
└── .env
```

## API 端点设计

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

## 认证流程

```
┌─────────────── 认证架构 ───────────────────────────────────────┐
│                                                                │
│  注册/登录                                                      │
│  ┌────────┐    POST /api/auth/register     ┌──────────────┐    │
│  │ 前端   │ ─────────────────────────────▶  │ FastAPI      │    │
│  │ 登录页 │    POST /api/auth/login         │              │    │
│  └────────┘ ─────────────────────────────▶  │ bcrypt 哈希  │    │
│       │                           │         │ JWT 签发     │    │
│       │    ◀──────────────────────┘         └──────────────┘    │
│       │    { access_token, token_type }                         │
│       │                                                         │
│       ▼                                                         │
│  存储 token (localStorage)                                     │
│                                                                │
│  已认证请求                                                     │
│  ┌────────┐    GET /api/courses              ┌──────────────┐   │
│  │ 前端   │ ─────────────────────────────▶   │ FastAPI      │   │
│  │        │  Authorization: Bearer <jwt>     │ Depends(     │   │
│  │        │                                  │   get_current│   │
│  │        │    ◀──────────────────────────── │   _user)    │   │
│  └────────┘    { courses data }              └──────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 认证技术选型

- **JWT 库**: PyJWT（活跃维护）
- **密码哈希**: bcrypt（通过 passlib 或直接使用 bcrypt 库）
- **Token 存储**: 前端 localStorage
- **Token 传输**: Authorization: Bearer \<jwt\>

## AI 对话交互

```
┌─────────────── AI 对话交互模式 ──────────────────────────┐
│                                                          │
│  流式响应（SSE）：                                        │
│  前端 ──POST /api/ai/chat──▶ FastAPI                     │
│     ◀─── SSE (text/event-stream) ────                    │
│     ◀─── data: {"token": "你"}                           │
│     ◀─── data: {"token": "好"}                           │
│     ◀─── data: {"token": "，"}                           │
│     ◀─── data: [DONE]                                    │
│                                                          │
│  FastAPI StreamingResponse + SSE                         │
│  前端 EventSource / fetch ReadableStream 消费             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## 前端 API 调用层

```typescript
// src/services/api.ts
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export async function fetchWithAuth(path: string, options?: RequestInit) {
  const token = localStorage.getItem('access_token')
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  if (res.status === 401) {
    // 跳转登录页
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }
  if (!res.ok) throw new Error(`API Error: ${res.status}`)
  return res.json()
}
```

## Vite 代理配置

```typescript
// vite.config.ts
export default defineConfig({
  base: '/my-website/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
```

## 类型共享策略

前后端独立仓库，推荐方式：

1. **初期**：手动保持类型同步（项目小，类型少）
2. **后期**：后端通过 `@hono/zod-openapi` 生成 OpenAPI spec，前端用代码生成器同步类型
