## ADDED Requirements

<!-- Verified: 2026-04-18 E2E test — AI-01 to AI-03 all PASS (BUG-3 role mapping fixed) -->

### Requirement: AI 对话辅导

系统 SHALL 通过 `POST /api/ai/chat` 提供基于课时上下文的 AI 对话。
响应 SHALL 使用 SSE（Server-Sent Events）流式返回。

#### Scenario: 成功发起对话

- **GIVEN** 用户已注册课程且课时存在
- **WHEN** 请求 `POST /api/ai/chat`，body 为 `{ lesson_id, message }`
- **THEN** 系统以 SSE 流式返回 AI 回复，每条事件包含 token 片段，最终发送 `[DONE]`

#### Scenario: 对话上下文包含课程信息

- **GIVEN** 课时配置了 ai_prompt
- **WHEN** AI 处理对话请求
- **THEN** 系统 SHALL 将 ai_prompt 作为 system message 注入 LLM 上下文

#### Scenario: 未注册课程发起对话

- **GIVEN** 用户未注册课时所属课程
- **WHEN** 请求 `POST /api/ai/chat`
- **THEN** 系统返回 403

#### Scenario: LLM 服务不可用

- **GIVEN** LLM API 无法连接
- **WHEN** 请求 `POST /api/ai/chat`
- **THEN** 系统返回 503 和错误信息 "AI service unavailable"

### Requirement: 对话历史持久化

系统 SHALL 将用户消息和 AI 回复持久化到 `chat_messages` 表。
数据库中 AI 消息的 role 存储为 `"ai"`，发送给 LLM API 时 SHALL 映射为 `"assistant"`。

> **Fixed (BUG-3)**: 原实现 `ai.py:49` 直接将数据库 `role="ai"` 发送给 OpenAI 兼容 API，
> 导致多轮对话失败。已修复为 `{"role": "assistant" if m.role == "ai" else m.role, ...}`。

#### Scenario: 消息保存

- **GIVEN** 对话成功完成
- **WHEN** SSE 流结束
- **THEN** 系统将 user 消息和 ai 回复各存入 chat_messages 表

### Requirement: 加载对话历史

系统 SHALL 通过课时关联返回历史对话记录。

#### Scenario: 获取课时对话历史

- **GIVEN** 用户在该课时有历史对话
- **WHEN** 请求课时详情或独立接口获取 chat_messages
- **THEN** 系统返回按 created_at 排序的对话列表（role, content, created_at）

### Requirement: 练习题生成

系统 SHALL 通过 `POST /api/ai/exercise` 根据课时内容生成练习题。

#### Scenario: 成功生成练习题

- **GIVEN** 用户已注册课程且课时存在
- **WHEN** 请求 `POST /api/ai/exercise`，body 为 `{ lesson_id, difficulty? }`
- **THEN** 系统返回 200，包含生成的练习题数组（question, options, answer）

#### Scenario: 指定难度生成

- **GIVEN** 课时难度为 intermediate
- **WHEN** 请求 `POST /api/ai/exercise` 指定 `difficulty: "advanced"`
- **THEN** 系统 SHALL 按指定难度生成练习题，不使用课时默认难度

#### Scenario: LLM 服务不可用

- **GIVEN** LLM API 无法连接
- **WHEN** 请求 `POST /api/ai/exercise`
- **THEN** 系统返回 503 和错误信息 "AI service unavailable"

### Requirement: 前端 AI 对话面板

前端 LearnPage SHALL 包含 AI 对话面板，支持 SSE 流式渲染。

#### Scenario: 流式渲染 AI 回复

- **GIVEN** 用户发送消息到 AI 助手
- **WHEN** SSE 事件陆续到达
- **THEN** 前端逐 token 渲染 AI 回复，显示打字效果

#### Scenario: 生成练习题按钮

- **GIVEN** 用户在学习页
- **WHEN** 点击"生成练习题"按钮
- **THEN** 前端调用 `/api/ai/exercise`，在课程内容区展示生成的练习题

## Implementation Notes

- **LLM Provider**: 当前使用 DashScope API（阿里云）`qwen3.5-plus` 模型，通过 OpenAI 兼容接口调用。
  配置位于 `server/.env`（`LLM_API_BASE`, `LLM_API_KEY`, `LLM_MODEL`）。
- **Thinking Model**: `qwen3.5-plus` 为思考模型，SSE 流中会先输出 `reasoning_content`，后端仅提取 `content` 部分返回前端。
- **Exercise Parsing**: LLM 返回的 JSON 可能被 Markdown 代码块包裹（` ```json ... ``` `），后端自动剥离。
