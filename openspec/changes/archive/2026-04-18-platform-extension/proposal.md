## Why

当前项目是纯前端个人品牌站（SPA），功能单一，无路由、无后端、无用户系统。
需要将其扩展为全栈 AI 学习平台：保留品牌主页作为公开入口，新增用户认证、
课程学习、AI 对话辅导和管理后台能力，使站点从静态展示升级为可交互的学习产品。

## What Changes

- **引入 react-router v7**：将单页锚点导航改造为多页面路由，支持三套独立布局
  （SiteLayout / AppLayout / AdminLayout）
- **新增用户认证系统**：JWT + bcrypt，包含注册、登录、角色（student / admin）
- **新增后端 API 服务**（`server/` 子目录，monorepo 结构）：FastAPI + SQLite + Alembic
- **新增 Dashboard 学习区**：课程列表、课程详情、学习页（Markdown 内容 + AI 对话面板）
- **新增 AI 学习功能**：LLM 对话辅导（SSE 流式）、练习题动态生成
- **新增管理后台**：课程/课时 CRUD、Markdown 编辑器、AI Prompt 配置、用户管理、数据统计
- **新增前端 API 调用层**：`src/services/` 统一管理 fetch 封装和 JWT 注入
- **新增学习进度追踪**：注册课程、课时完成状态、学习笔记
- **保留品牌主页**：Hero / About / Projects 重组为 HomePage + SiteLayout，功能不变

## Capabilities

### New Capabilities

- `user-auth`：用户注册、登录、JWT 认证、角色（student/admin）
- `course-management`：课程和课时的 CRUD，课程发布/下架，课时排序
- `learning-progress`：课程注册、课时学习进度追踪、完成标记、学习笔记
- `ai-tutoring`：基于课时 context 的 AI 对话辅导（SSE 流式响应）、练习题生成
- `admin-panel`：管理后台界面，课程/课时/用户管理，数据统计
- `frontend-routing`：react-router v7 多页面路由，三套布局壳，路由守卫

### Modified Capabilities

（无现有 spec 需要修改，所有 capability 均为新增）

## Impact

### 前端（当前仓库 my_website）

- **修改文件**：`src/App.tsx`（路由壳）、`src/main.tsx`（BrowserRouter）、`vite.config.ts`（API proxy）、`package.json`（新依赖）
- **新增目录**：`src/layouts/`、`src/pages/`、`src/services/`、`src/components/ui/`、`src/components/chat/`、`src/components/course/`
- **新增 Hooks**：`useAuth.tsx`、`useChat.ts`
- **保持不变**：Hero / About / Projects / Navbar / Footer / ThemeProvider / ParticleCanvas 相关组件
- **新增依赖**：react-router v7、react-markdown + remark
- **构建不受影响**：后端在 `server/` 子目录，前端 `npm run build` 不依赖后端

### 后端（`server/` 子目录，monorepo 结构）

- FastAPI 应用，包含 auth / courses / lessons / progress / ai / admin / users 七组路由
- SQLite 数据库（6 张表：users / courses / lessons / enrollments / progress / chat_messages）
- Alembic 数据库迁移
- PyJWT + bcrypt 认证
- LLM API 集成（DashScope qwen3.5-plus，对话 + 练习生成）

### 回滚方案

| 风险项 | 回滚策略 |
|--------|----------|
| 路由改造破坏品牌主页 | `App.tsx` 保留原始组件引用，路由为纯增量添加；回滚只需删除 BrowserRouter 包裹，恢复原 App.tsx |
| 前端构建失败 | react-router 为可选依赖，不影响 Vite 构建；移除路由相关 import 即可恢复 |
| 后端启动失败 | 后端在 `server/` 子目录，不影响前端；删除 server/ 目录即可 |

## Out of Scope（NOT Doing）

- 不做品牌主页内容变更（Hero / About / Projects 数据和样式保持原样）
- 不做 SEO 优化（SSR / SSG）
- 不做国际化（i18n）
- 不做邮件验证 / 密码重置
- 不做 OAuth 第三方登录（Google / GitHub）
- 不做支付系统
- 不做移动端 App
- 不做生产环境部署配置（CI/CD、域名、SSL）
- 不做 WebSocket 实时通信（AI 对话使用 SSE）
- 不做图片/文件上传服务
- 不做前端单元测试 / E2E 测试（本阶段）
- 不做代码编辑器集成（code 类型课时仅展示，无在线运行能力）
