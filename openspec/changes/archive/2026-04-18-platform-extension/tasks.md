## 1. 前端路由基础

- [x] 1.1 安装 react-router v7 依赖
- [x] 1.2 创建 `src/pages/HomePage.tsx`，组合现有 HeroSection + AboutSection + ProjectShowcase
- [x] 1.3 创建 `src/layouts/SiteLayout.tsx`，包裹 Navbar + Outlet + Footer
- [x] 1.4 创建 `src/pages/NotFound.tsx`（404 页面）
- [x] 1.5 改造 `src/App.tsx` 为 BrowserRouter + Routes 路由壳
- [x] 1.6 改造 `src/main.tsx`，确保 ThemeProvider 在 BrowserRouter 外层
- [x] 1.7 **验证**：启动 `npm run dev`，确认 `/` 路由渲染结果与改造前完全一致

## 2. 前端认证体系

- [x] 2.1 创建 `src/services/api.ts`（fetch 封装 + JWT Bearer 注入 + 401 跳转）
- [x] 2.2 创建 `src/services/auth.ts`（login / register / getMe 函数）
- [x] 2.3 创建 `src/hooks/useAuth.tsx`（AuthContext + AuthProvider + useAuth Hook）
- [x] 2.4 创建 `src/pages/LoginPage.tsx`（全屏独立布局，邮箱+密码表单）
- [x] 2.5 创建 `src/pages/RegisterPage.tsx`（全屏独立布局，邮箱+密码+确认密码表单）
- [x] 2.6 在 App.tsx 中添加 `/login`、`/register` 路由（无 Layout 壳）
- [x] 2.7 在 AuthProvider 中实现：已登录用户访问 `/login` 自动跳转 `/dashboard`
- [x] 2.8 **验证**：启动前端 dev server，确认登录页和注册页正确渲染，表单校验生效

## 3. 前端 Dashboard 布局

- [x] 3.1 创建 `src/layouts/AppLayout.tsx`（Sidebar + TopBar + Outlet）
- [x] 3.2 创建 `src/components/layout/Sidebar.tsx`（导航链接：概览/课程/设置）
- [x] 3.3 实现 AppLayout 路由守卫：未认证跳转 `/login?redirect=...`
- [x] 3.4 创建 `src/pages/dashboard/DashboardPage.tsx`（占位：欢迎信息 + 统计卡片骨架）
- [x] 3.5 创建 `src/pages/dashboard/ProfilePage.tsx`（占位：个人信息展示骨架）
- [x] 3.6 在 App.tsx 中添加 `/dashboard/*` 路由组，嵌套子路由
- [x] 3.7 **验证**：未登录访问 `/dashboard` 跳转到 `/login`；登录后展示 Dashboard 布局

## 4. 后端项目搭建

- [x] 4.1 创建独立仓库 `my_website_api`，使用 `uv init` 初始化项目（pyproject.toml + uv.lock）
- [x] 4.2 创建 FastAPI 入口 `app/main.py`（app 实例 + CORS 中间件 + health check）
- [x] 4.3 创建 `app/config.py`（Settings：DATABASE_URL, SECRET_KEY, LLM_API_KEY）
- [x] 4.4 创建 `app/database.py`（SQLite 连接 + session 管理 + engine）
- [x] 4.5 创建 `app/models/` 下所有 SQLAlchemy 模型（users, courses, lessons, enrollments, progress, chat_messages）
- [x] 4.6 配置 Alembic，生成初始迁移脚本并执行
- [x] 4.7 **验证**：启动 `uv run uvicorn app.main:app --reload`，确认 `/docs` 页面可访问，数据库文件已创建

## 5. 后端认证 API

- [x] 5.1 创建 `app/utils/security.py`（bcrypt 哈希 + PyJWT 签发/验证）
- [x] 5.2 创建 `app/schemas/auth.py`（RegisterRequest, LoginRequest, TokenResponse, UserResponse）
- [x] 5.3 创建 `app/middleware/auth.py`（get_current_user 依赖：解析 JWT → 查询用户）
- [x] 5.4 创建 `app/routers/auth.py`：`POST /api/auth/register`（邮箱校验 + 密码 ≥8 字符）
- [x] 5.5 创建 `app/routers/auth.py`：`POST /api/auth/login`（验证密码 + 返回 JWT）
- [x] 5.6 创建 `app/routers/auth.py`：`GET /api/auth/me`（需 Bearer token）
- [x] 5.7 **验证**：通过 `/docs` Swagger UI 测试注册 → 登录 → 获取用户信息完整流程

## 6. 后端课程与课时 API

- [x] 6.1 创建 `app/schemas/course.py` 和 `app/schemas/lesson.py`（Pydantic schema）
- [x] 6.2 创建 `app/routers/courses.py`：`GET /api/courses`（已发布列表 + category/difficulty 筛选）
- [x] 6.3 创建 `app/routers/courses.py`：`GET /api/courses/:id`（详情 + 课时目录）
- [x] 6.4 创建 `app/routers/courses.py`：`POST /api/courses/:id/enroll`（注册 + 自动创建 progress）
- [x] 6.5 创建 `app/routers/lessons.py`：`GET /api/lessons/:id`（课时内容，需注册检查）
- [x] 6.6 **验证**：通过 Swagger 创建测试课程和课时，验证列表/详情/注册/内容查询

## 7. 后端学习进度 API

- [x] 7.1 创建 `app/schemas/progress.py`（Pydantic schema）
- [x] 7.2 创建 `app/routers/progress.py`：`GET /api/progress`（全部进度）
- [x] 7.3 创建 `app/routers/progress.py`：`GET /api/progress/course/:id`（课程进度，需注册检查）
- [x] 7.4 创建 `app/routers/progress.py`：`PUT /api/progress/:id`（更新状态，需所有权检查）
- [x] 7.5 **验证**：注册课程后验证 progress 自动创建，更新状态后验证 completed_at 正确设置

## 8. 后端 AI 服务 API

- [x] 8.1 创建 `app/services/ai_service.py`（LLM API 调用封装，支持流式输出）
- [x] 8.2 创建 `app/schemas/chat.py`（ChatRequest, ExerciseRequest, ExerciseResponse）
- [x] 8.3 创建 `app/routers/ai.py`：`POST /api/ai/chat`（SSE StreamingResponse + 上下文注入 ai_prompt）
- [x] 8.4 创建 `app/routers/ai.py`：`POST /api/ai/exercise`（练习题生成）
- [x] 8.5 实现对话历史持久化（chat_messages 表写入）
- [x] 8.6 **验证**：通过 curl 测试 SSE 流式对话，验证 ai_prompt 注入和历史保存

## 9. 后端 Admin API

- [x] 9.1 创建 `app/middleware/auth.py` 中的 `require_admin` 依赖（role=admin 检查）
- [x] 9.2 创建 `app/routers/admin.py`：课程 CRUD（含未发布课程查询、删除注册检查）
- [x] 9.3 创建 `app/routers/admin.py`：课时 CRUD（含级联删除 progress + chat_messages）
- [x] 9.4 创建 `app/routers/admin.py`：用户管理（列表 + 角色修改）
- [x] 9.5 创建 `app/routers/admin.py`：`GET /api/admin/stats`（统计数据聚合）
- [x] 9.6 **验证**：以 admin 角色测试所有 Admin 端点，以 student 角色验证 403 拒绝

## 10. 前端 Dashboard 页面对接

- [x] 10.1 配置 `vite.config.ts` 添加 `/api` proxy 到后端
- [x] 10.2 创建 `src/services/courses.ts`（课程列表/详情/注册 API 调用）
- [x] 10.3 创建 `src/components/course/CourseCard.tsx`（课程卡片组件）
- [x] 10.4 创建 `src/pages/dashboard/CoursesPage.tsx`（课程列表页，含筛选）
- [x] 10.5 创建 `src/pages/dashboard/CourseDetailPage.tsx`（课程详情 + 课时目录 + 注册按钮）
- [x] 10.6 接入 DashboardPage：调用 `/api/progress` 展示真实统计数据
- [x] 10.7 创建 `src/pages/dashboard/ProfilePage.tsx` 完整版（展示/编辑个人信息）
- [x] 10.8 **验证**：前后端联调，注册 → 登录 → 浏览课程 → 注册课程 → 查看进度完整流程

> 补充修复：
> - 后端新增 `PUT /api/auth/me`（更新 display_name）、`PUT /api/auth/me/password`（修改密码）
> - 后端新增 `GET /api/courses/enrollments/list`（用户注册课程列表）
> - DashboardPage 展示：已注册课程数、已完成课时数、总课时数、完成率百分比
> - design.md API 端点表同步更新（用户端点合并到 /api/auth，新增注册列表端点）

## 11. 前端 AI 学习页

- [x] 11.1 安装 react-markdown + remark 依赖
- [x] 11.2 创建 `src/hooks/useChat.ts`（SSE 流式消费 Hook）
- [x] 11.3 创建 `src/components/chat/ChatMessage.tsx`（消息气泡组件）
- [x] 11.4 创建 `src/components/chat/ChatPanel.tsx`（对话面板：历史 + 输入框 + 流式渲染）
- [x] 11.5 创建 `src/components/course/ProgressBar.tsx`（课时进度组件）
- [x] 11.6 创建 `src/pages/dashboard/LearnPage.tsx`（左侧 Markdown 内容 + 右侧 AI 面板 + 底部导航）
- [x] 11.7 实现练习题生成交互（调用 `/api/ai/exercise` + 结果渲染）
- [x] 11.8 实现学习进度操作（标记完成 → 调用 `/api/progress/:id`）
- [ ] 11.9 **验证**：进入学习页 → 阅读 Markdown 内容 → 与 AI 对话 → 生成练习题 → 标记完成

## 12. 前端 Admin 管理后台

- [x] 12.1 创建 `src/layouts/AdminLayout.tsx`（AdminSidebar + TopBar + Outlet）
- [x] 12.2 实现 Admin 路由守卫（role !== admin → 403 页面）
- [x] 12.3 创建 `src/pages/admin/CoursesAdmin.tsx`（课程管理表格 + 新建/编辑表单）
- [x] 12.4 创建 `src/pages/admin/LessonEditor.tsx`（课时列表 + Markdown 编辑器 + AI Prompt 编辑）
- [x] 12.5 创建 `src/pages/admin/UsersAdmin.tsx`（用户列表 + 角色切换）
- [x] 12.6 创建 `src/pages/admin/StatsPage.tsx`（平台统计数据展示）
- [x] 12.7 在 App.tsx 中添加 `/admin/*` 路由组
- [ ] 12.8 **验证**：以 admin 登录 → 创建课程 → 添加课时 → 设置 AI Prompt → 以 student 身份验证可见性
