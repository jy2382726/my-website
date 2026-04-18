## ADDED Requirements

### Requirement: Admin 角色鉴权

系统 SHALL 限制 `/api/admin/*` 端点仅允许 role=admin 的用户访问。

#### Scenario: Admin 用户访问管理接口

- **GIVEN** 用户 role 为 admin
- **WHEN** 请求任意 `/api/admin/*` 端点
- **THEN** 系统正常处理并返回数据

#### Scenario: 非 Admin 用户访问管理接口

- **GIVEN** 用户 role 为 student
- **WHEN** 请求任意 `/api/admin/*` 端点
- **THEN** 系统返回 403 和错误信息 "Admin access required"

### Requirement: 课程管理 CRUD

系统 SHALL 通过 Admin 端点提供课程的完整 CRUD 操作。

#### Scenario: 创建课程

- **GIVEN** Admin 用户已认证
- **WHEN** 请求 `POST /api/admin/courses`，body 包含 title, description, category, difficulty
- **THEN** 系统创建课程记录（is_published 默认 false），返回 201

#### Scenario: 更新课程

- **GIVEN** 课程存在
- **WHEN** 请求 `PUT /api/admin/courses/:id`
- **THEN** 系统更新课程字段，返回 200

#### Scenario: 删除课程

- **GIVEN** 课程存在且无用户注册
- **WHEN** 请求 `DELETE /api/admin/courses/:id`
- **THEN** 系统删除课程及关联课时，返回 204

#### Scenario: 删除已注册课程

- **GIVEN** 课程已有用户注册
- **WHEN** 请求 `DELETE /api/admin/courses/:id`
- **THEN** 系统返回 409 和错误信息 "Course has enrollments, cannot delete"

### Requirement: 课时管理 CRUD

系统 SHALL 通过 Admin 端点提供课时的完整 CRUD 操作。

#### Scenario: 创建课时

- **GIVEN** 课程存在
- **WHEN** 请求 `POST /api/admin/courses/:id/lessons`，body 包含 title, content, order, lesson_type
- **THEN** 系统创建课时记录，返回 201

#### Scenario: 更新课时（含 AI Prompt）

- **GIVEN** 课时存在
- **WHEN** 请求 `PUT /api/admin/lessons/:id`，body 包含 ai_prompt 字段
- **THEN** 系统更新课时内容和 AI Prompt，返回 200

#### Scenario: 删除课时

- **GIVEN** 课时存在
- **WHEN** 请求 `DELETE /api/admin/lessons/:id`
- **THEN** 系统删除课时及关联的 progress 和 chat_messages，返回 204

### Requirement: 用户管理

系统 SHALL 通过 Admin 端点提供用户列表和角色修改。

#### Scenario: 获取用户列表

- **GIVEN** Admin 用户已认证
- **WHEN** 请求 `GET /api/admin/users`
- **THEN** 系统返回所有用户列表（id, email, display_name, role, created_at），不含密码

#### Scenario: 修改用户角色

- **GIVEN** 目标用户存在
- **WHEN** 请求 `PUT /api/admin/users/:id/role`，body 为 `{ role: "admin" }`
- **THEN** 系统更新用户角色，返回 200

### Requirement: 数据统计

系统 SHALL 通过 `GET /api/admin/stats` 返回平台统计数据。

#### Scenario: 获取统计数据

- **GIVEN** Admin 用户已认证
- **WHEN** 请求 `GET /api/admin/stats`
- **THEN** 系统返回 200，包含 { total_users, total_courses, total_enrollments, completion_rate }

### Requirement: 前端 Admin 路由保护

前端 `/admin/*` 路由 SHALL 检查用户 role，非 admin 显示 403 页面。

#### Scenario: Admin 用户访问管理页面

- **GIVEN** 用户 role 为 admin
- **WHEN** 访问 `/admin/courses`
- **THEN** 正常渲染管理页面

#### Scenario: 非 Admin 用户访问管理页面

- **GIVEN** 用户 role 为 student
- **WHEN** 访问 `/admin/courses`
- **THEN** 显示 403 禁止访问页面
