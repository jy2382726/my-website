## ADDED Requirements

### Requirement: 查询学习进度

系统 SHALL 通过 `GET /api/progress` 返回当前用户的所有学习进度。
系统 SHALL 通过 `GET /api/progress/course/:id` 返回指定课程下的进度。

#### Scenario: 获取全部进度

- **GIVEN** 用户已注册课程且存在学习记录
- **WHEN** 请求 `GET /api/progress`
- **THEN** 系统返回 200，包含所有 progress 记录（含 lesson_id, status, completed_at）

#### Scenario: 获取指定课程进度

- **GIVEN** 用户已注册某课程
- **WHEN** 请求 `GET /api/progress/course/:id`
- **THEN** 系统返回 200，仅包含该课程下所有课时的进度

#### Scenario: 未注册课程查询进度

- **GIVEN** 用户未注册某课程
- **WHEN** 请求 `GET /api/progress/course/:id`
- **THEN** 系统返回 403

### Requirement: 更新学习进度

系统 SHALL 通过 `PUT /api/progress/:id` 更新课时的学习状态。
状态值 SHALL 为 `not_started` / `in_progress` / `completed` 之一。

#### Scenario: 标记课时完成

- **GIVEN** 用户已注册课程且存在 progress 记录
- **WHEN** 请求 `PUT /api/progress/:id`，body 为 `{ status: "completed" }`
- **THEN** 系统更新 status 为 completed，设置 completed_at 为当前时间，返回 200

#### Scenario: 无效状态值

- **GIVEN** 任意状态
- **WHEN** 请求 `PUT /api/progress/:id`，body 为 `{ status: "invalid" }`
- **THEN** 系统返回 422 和校验错误

#### Scenario: 更新他人进度

- **GIVEN** progress 记录属于其他用户
- **WHEN** 请求 `PUT /api/progress/:id`
- **THEN** 系统返回 403

### Requirement: 自动创建进度记录

系统 SHALL 在用户注册课程时，自动为课程下所有已发布课时创建 `not_started` 状态的 progress 记录。

#### Scenario: 注册课程时自动初始化进度

- **GIVEN** 课程下有 5 个已发布课时
- **WHEN** 用户注册该课程
- **THEN** 系统自动创建 5 条 status=not_started 的 progress 记录

### Requirement: Dashboard 学习概览

前端 Dashboard 页面 SHALL 展示用户的学习概览统计。

#### Scenario: 显示进度统计

- **GIVEN** 用户已登录且有学习记录
- **WHEN** 用户访问 `/dashboard`
- **THEN** 页面展示：已注册课程数、已完成课时数、总课时数、完成率百分比
