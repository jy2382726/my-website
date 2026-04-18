## ADDED Requirements

### Requirement: 用户注册

系统 SHALL 提供邮箱 + 密码注册功能。密码 SHALL 使用 bcrypt 哈希后存储。
新用户角色默认为 `student`。

#### Scenario: 成功注册

- **GIVEN** 邮箱未被注册
- **WHEN** 用户提交 email 和 password（≥8 字符）到 `POST /api/auth/register`
- **THEN** 系统创建用户记录，返回 201 和用户信息（不含密码）

#### Scenario: 邮箱已存在

- **GIVEN** 邮箱已被注册
- **WHEN** 用户提交相同 email 到 `POST /api/auth/register`
- **THEN** 系统返回 409 和错误信息 "Email already registered"

#### Scenario: 密码过短

- **GIVEN** 任意状态
- **WHEN** 用户提交密码少于 8 字符
- **THEN** 系统返回 422 和校验错误信息

### Requirement: 用户登录

系统 SHALL 提供邮箱 + 密码登录功能。登录成功后返回 JWT access_token。

#### Scenario: 登录成功

- **GIVEN** 用户已注册且密码正确
- **WHEN** 用户提交 email 和 password 到 `POST /api/auth/login`
- **THEN** 系统返回 200 和 `{ access_token, token_type: "bearer" }`

#### Scenario: 密码错误

- **GIVEN** 用户已注册
- **WHEN** 用户提交错误密码
- **THEN** 系统返回 401 和错误信息 "Invalid credentials"

#### Scenario: 用户不存在

- **GIVEN** 邮箱未注册
- **WHEN** 用户提交不存在的 email
- **THEN** 系统返回 401 和错误信息 "Invalid credentials"

### Requirement: JWT 认证保护

系统 SHALL 通过 `Authorization: Bearer <token>` 验证请求身份。
无效或过期 token SHALL 返回 401。

#### Scenario: 有效 token 访问受保护资源

- **GIVEN** 用户持有有效 JWT
- **WHEN** 请求携带 `Authorization: Bearer <token>` 访问受保护端点
- **THEN** 系统正常处理请求并返回数据

#### Scenario: 无 token 访问受保护资源

- **GIVEN** 请求未携带 Authorization 头
- **WHEN** 访问受保护端点
- **THEN** 系统返回 401

#### Scenario: 过期 token

- **GIVEN** 用户持有已过期的 JWT
- **WHEN** 请求携带过期 token 访问受保护端点
- **THEN** 系统返回 401 和错误信息 "Token expired"

### Requirement: 获取当前用户信息

系统 SHALL 通过 `GET /api/auth/me` 返回当前认证用户的信息。

#### Scenario: 成功获取

- **GIVEN** 用户已认证
- **WHEN** 请求 `GET /api/auth/me`
- **THEN** 系统返回 200 和用户信息（id, email, display_name, avatar_url, role）

### Requirement: 前端认证状态管理

前端 SHALL 通过 `useAuth` Context 管理认证状态。
未认证用户访问受保护路由 SHALL 重定向到 `/login`。

#### Scenario: 未认证访问 Dashboard

- **GIVEN** 用户未登录（localStorage 无 token）
- **WHEN** 用户访问 `/dashboard` 任意路由
- **THEN** 前端重定向到 `/login`

#### Scenario: 认证后跳转

- **GIVEN** 用户在 `/login` 页面
- **WHEN** 登录成功
- **THEN** 前端跳转到 `/dashboard`
