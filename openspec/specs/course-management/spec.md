## ADDED Requirements

<!-- Verified: 2026-04-18 E2E test — CM-01, CM-02, CM-03, LP-01 all PASS -->

### Requirement: 课程列表查询

系统 SHALL 通过 `GET /api/courses` 返回已发布课程列表。
支持按 category 和 difficulty 筛选。

#### Scenario: 获取所有已发布课程

- **GIVEN** 数据库中存在已发布和未发布课程
- **WHEN** 已认证用户请求 `GET /api/courses`
- **THEN** 系统返回 200，仅包含 `is_published=true` 的课程

#### Scenario: 按分类筛选

- **GIVEN** 数据库中存在不同分类的课程
- **WHEN** 请求 `GET /api/courses?category=AI基础`
- **THEN** 系统返回 200，仅包含该分类的已发布课程

#### Scenario: 课程为空

- **GIVEN** 数据库中无已发布课程
- **WHEN** 请求 `GET /api/courses`
- **THEN** 系统返回 200 和空数组 `[]`

### Requirement: 课程详情查询

系统 SHALL 通过 `GET /api/courses/:id` 返回课程详情及课时目录。

#### Scenario: 成功获取课程详情

- **GIVEN** 课程存在且已发布
- **WHEN** 已认证用户请求 `GET /api/courses/:id`
- **THEN** 系统返回 200，包含课程信息和已发布的课时列表（按 order 排序）

#### Scenario: 课程不存在

- **GIVEN** 课程 ID 不存在
- **WHEN** 请求 `GET /api/courses/99999`
- **THEN** 系统返回 404

#### Scenario: 访问未发布课程

- **GIVEN** 课程存在但 `is_published=false`
- **WHEN** 非 admin 用户请求 `GET /api/courses/:id`
- **THEN** 系统返回 404

### Requirement: 课时内容查询

系统 SHALL 通过 `GET /api/lessons/:id` 返回课时详情（含 Markdown 内容）。

#### Scenario: 成功获取课时

- **GIVEN** 课时存在且已发布，且用户已注册该课程
- **WHEN** 请求 `GET /api/lessons/:id`
- **THEN** 系统返回 200，包含 title、content（Markdown）、lesson_type、ai_prompt

#### Scenario: 未注册课程访问课时

- **GIVEN** 课时存在但用户未注册所属课程
- **WHEN** 请求 `GET /api/lessons/:id`
- **THEN** 系统返回 403 和错误信息 "Not enrolled in this course"

### Requirement: 课程注册

系统 SHALL 通过 `POST /api/courses/:id/enroll` 允许用户注册课程。

#### Scenario: 成功注册

- **GIVEN** 用户未注册该课程
- **WHEN** 请求 `POST /api/courses/:id/enroll`
- **THEN** 系统创建 enrollment 记录，返回 201

#### Scenario: 重复注册

- **GIVEN** 用户已注册该课程
- **WHEN** 请求 `POST /api/courses/:id/enroll`
- **THEN** 系统返回 409 和错误信息 "Already enrolled"

### Requirement: 查询已注册课程

系统 SHALL 通过 `GET /api/courses/enrollments/list` 返回当前用户已注册的课程列表。

#### Scenario: 获取已注册课程

- **GIVEN** 用户已注册若干课程
- **WHEN** 请求 `GET /api/courses/enrollments/list`
- **THEN** 系统返回 200，包含课程 ID、标题和注册时间
