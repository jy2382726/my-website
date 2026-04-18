## ADDED Requirements

### Requirement: 多页面路由

系统 SHALL 使用 react-router v7 实现多页面路由。
前端 SHALL 包含以下路由组：品牌主页、认证页面、Dashboard、Admin。

#### Scenario: 品牌主页路由

- **GIVEN** 任意用户
- **WHEN** 访问 `/`
- **THEN** 渲染 SiteLayout 包裹的 HomePage（Hero + About + Projects），无需认证

#### Scenario: 404 路由

- **GIVEN** 任意用户
- **WHEN** 访问未定义的路径
- **THEN** 渲染 NotFound 页面

### Requirement: 三套布局壳

系统 SHALL 提供 SiteLayout、AppLayout、AdminLayout 三套独立布局。

#### Scenario: SiteLayout 包裹公开页面

- **GIVEN** 用户访问 `/`
- **WHEN** SiteLayout 渲染
- **THEN** 包含 Navbar（顶部固定）+ `<Outlet />` + Footer

#### Scenario: AppLayout 包裹 Dashboard

- **GIVEN** 已认证用户访问 `/dashboard/*`
- **WHEN** AppLayout 渲染
- **THEN** 包含 Sidebar（左侧）+ TopBar（顶部）+ `<Outlet />`，无 Footer

#### Scenario: AdminLayout 包裹管理后台

- **GIVEN** admin 用户访问 `/admin/*`
- **WHEN** AdminLayout 渲染
- **THEN** 包含 AdminSidebar + TopBar + `<Outlet />`

### Requirement: 路由守卫

系统 SHALL 对受保护路由实施认证和角色检查。

#### Scenario: 未认证访问 Dashboard 路由

- **GIVEN** localStorage 无 access_token
- **WHEN** 用户访问 `/dashboard` 或其子路由
- **THEN** 重定向到 `/login`，并在 URL 中携带 `?redirect=/dashboard`

#### Scenario: 登录后跳转回原页面

- **GIVEN** 用户因未认证被重定向到 `/login?redirect=/dashboard/courses`
- **WHEN** 登录成功
- **THEN** 跳转到 redirect 参数指定的页面 `/dashboard/courses`

#### Scenario: 非 Admin 访问 Admin 路由

- **GIVEN** 用户已认证但 role 不为 admin
- **WHEN** 用户访问 `/admin/*`
- **THEN** 渲染 403 Forbidden 页面

### Requirement: 认证页面独立布局

登录和注册页面 SHALL 使用独立全屏布局，不包含 Navbar 和 Footer。

#### Scenario: 登录页渲染

- **GIVEN** 任意用户
- **WHEN** 访问 `/login`
- **THEN** 渲染全屏登录表单（邮箱 + 密码 + 登录按钮 + 注册链接），复用品牌站主题色

#### Scenario: 注册页渲染

- **GIVEN** 任意用户
- **WHEN** 访问 `/register`
- **THEN** 渲染全屏注册表单（邮箱 + 密码 + 确认密码 + 注册按钮 + 登录链接）

#### Scenario: 已认证用户访问登录页

- **GIVEN** 用户已登录
- **WHEN** 访问 `/login`
- **THEN** 重定向到 `/dashboard`

### Requirement: 品牌主页内容不变

路由改造后，品牌主页 SHALL 保持与当前完全一致的内容和功能。

#### Scenario: 主页功能一致性

- **GIVEN** 路由改造完成
- **WHEN** 访问 `/`
- **THEN** HeroSection（含粒子动画）、AboutSection、ProjectShowcase 的渲染结果与改造前完全一致
