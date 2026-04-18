# 数据库 Schema 设计 (SQLite)

## ER 图

```
┌─────────────── users ───────────────┐
│ id          PK AUTOINCREMENT        │
│ email       TEXT UNIQUE NOT NULL    │
│ hashed_pw   TEXT NOT NULL           │
│ display_name TEXT                    │
│ avatar_url  TEXT                     │
│ role        TEXT DEFAULT 'student'  │
│             (student / admin)        │
│ created_at  DATETIME DEFAULT NOW    │
└──────────┬──────────────────────────┘
           │ 1:N
           ├──────────────────────┐
           ▼                      ▼
┌──── enrollments ────┐  ┌──── progress ──────────────────┐
│ id          PK      │  │ id          PK                  │
│ user_id     FK      │  │ user_id     FK → users          │
│ course_id   FK      │  │ lesson_id   FK → lessons        │
│ enrolled_at         │  │ status      TEXT                 │
│ completed_at        │  │   (not_started/in_progress/     │
└───────┬─────────────┘  │    completed)                   │
        │                │ notes       TEXT                 │
        │ N:1            │ completed_at DATETIME            │
        ▼                └──────────────────────────────────┘
┌──── courses ──────────────────────────────────────────────┐
│ id          PK AUTOINCREMENT                              │
│ title       TEXT                                          │
│ description TEXT                                          │
│ category    TEXT                                          │
│ difficulty  TEXT (beginner / intermediate / advanced)      │
│ cover_url   TEXT                                          │
│ is_published BOOL DEFAULT FALSE                           │
│ created_at  DATETIME DEFAULT NOW                          │
│ updated_at  DATETIME DEFAULT NOW                          │
└──────────┬───────────────────────────────────────────────┘
           │ 1:N
           ▼
┌──── lessons ──────────────────────────────────────────────┐
│ id          PK AUTOINCREMENT                              │
│ course_id   FK → courses                                  │
│ title       TEXT                                          │
│ content     TEXT (Markdown)                               │
│ order       INTEGER                                       │
│ lesson_type TEXT (text / code / exercise)                 │
│ ai_prompt   TEXT (AI 对话的系统提示)                       │
│ is_published BOOL DEFAULT FALSE                           │
│ created_at  DATETIME DEFAULT NOW                          │
└──────────┬───────────────────────────────────────────────┘
           │ 1:N
           ▼
┌──── chat_messages ────────────────────────────────────────┐
│ id          PK AUTOINCREMENT                              │
│ user_id     FK → users                                    │
│ lesson_id   FK → lessons                                  │
│ role        TEXT (user / ai)                               │
│ content     TEXT                                          │
│ created_at  DATETIME DEFAULT NOW                          │
└───────────────────────────────────────────────────────────┘
```

## 表关系总览

```
user ─1:N─→ enrollments ─N:1─→ course
user ─1:N─→ progress    ─N:1─→ lesson ─N:1─→ course
user ─1:N─→ chat_messages ─N:1→ lesson
lesson.ai_prompt → 控制 AI 对话的系统上下文
```

## 字段说明

### users

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增主键 |
| email | TEXT UNIQUE | 登录邮箱 |
| hashed_pw | TEXT | bcrypt 哈希密码 |
| display_name | TEXT | 显示名称 |
| avatar_url | TEXT | 头像 URL |
| role | TEXT | 角色：student（默认）或 admin |
| created_at | DATETIME | 注册时间 |

### courses

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增主键 |
| title | TEXT | 课程标题 |
| description | TEXT | 课程描述 |
| category | TEXT | 分类（如 "AI基础", "机器学习", "深度学习"） |
| difficulty | TEXT | 难度：beginner / intermediate / advanced |
| cover_url | TEXT | 封面图 URL |
| is_published | BOOL | 是否发布（管理后台控制） |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### lessons

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增主键 |
| course_id | INTEGER FK | 所属课程 |
| title | TEXT | 课时标题 |
| content | TEXT | 课程正文（Markdown 格式） |
| order | INTEGER | 排序序号 |
| lesson_type | TEXT | 类型：text（纯文本）/ code（代码）/ exercise（练习） |
| ai_prompt | TEXT | AI 对话的系统提示（指导 AI 辅导风格和范围） |
| is_published | BOOL | 是否发布 |
| created_at | DATETIME | 创建时间 |

### enrollments

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增主键 |
| user_id | INTEGER FK | 注册用户 |
| course_id | INTEGER FK | 注册课程 |
| enrolled_at | DATETIME | 注册时间 |
| completed_at | DATETIME | 完成时间（可为空） |

### progress

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增主键 |
| user_id | INTEGER FK | 用户 |
| lesson_id | INTEGER FK | 课时 |
| status | TEXT | 状态：not_started / in_progress / completed |
| notes | TEXT | 学习笔记 |
| completed_at | DATETIME | 完成时间 |

### chat_messages

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增主键 |
| user_id | INTEGER FK | 用户 |
| lesson_id | INTEGER FK | 关联课时 |
| role | TEXT | 消息角色：user / ai |
| content | TEXT | 消息内容 |
| created_at | DATETIME | 消息时间 |
