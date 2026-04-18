## Context

当前项目分为两个独立仓库：
- **前端** `my_website`：React 19 + Vite 8 + TypeScript 6，位于 `/root/projects/my_website`
- **后端** `my_website_api`：FastAPI + SQLAlchemy + SQLite，位于 `/root/projects/my_website_api`

开发时需要分别启动两个服务，管理两套 git 历史。合并后可简化工作流，统一版本控制。

### 当前后端结构

```
my_website_api/
├── app/
│   ├── main.py          # FastAPI 入口 + CORS
│   ├── config.py         # pydantic-settings
│   ├── database.py       # SQLite engine + session
│   ├── models/           # SQLAlchemy 模型（6 个）
│   ├── schemas/          # Pydantic schema（5 个）
│   ├── routers/          # API 路由（5 个）
│   ├── middleware/        # auth 中间件
│   ├── services/         # AI 服务
│   └── utils/            # security 工具
├── migrations/
│   └── versions/         # Alembic 迁移脚本
├── alembic.ini
├── pyproject.toml
└── uv.lock
```

## Goals / Non-Goals

**Goals:**
- 将后端代码移入 `server/` 子目录，保持完整可运行
- 后端数据库路径、Alembic 配置相对于 `server/` 正确工作
- `.gitignore` 覆盖前后端忽略规则
- 前端 Vite proxy 配置无需修改（已指向 `127.0.0.1:3002`）

**Non-Goals:**
- 不引入 monorepo 工具链（Turborepo、Nx、Lerna）
- 不修改 API 端点或数据模型
- 不修改前端组件逻辑
- 不配置 Docker 或 CI/CD
- 不做代码重构或优化

## Decisions

### D1: 后端放入 `server/` 目录

**选择**: `server/` 子目录
**备选**: `backend/`、`api/`、Python workspace
**理由**: `server/` 语义明确，与前端根目录形成清晰的前后端分离。不使用 `api/` 因为后端包含的不只是 API（还有数据库、迁移等）。

### D2: 直接文件复制，非 git subtree

**选择**: 手动复制文件，不保留原仓库 git 历史
**备选**: `git subtree add`、`git submodule`
**理由**: 后端只有一个初始迁移，历史价值低。submodule 增加复杂度，subtree 会带入不需要的历史。直接复制最简单可靠。

### D3: 保持 uv 独立虚拟环境

**选择**: `server/` 下独立的 `.venv/` 和 `uv.lock`
**备选**: 项目根目录统一 uv 管理
**理由**: 前端用 npm、后端用 uv，两套工具链天然隔离。强行统一反而增加复杂度。开发时分别 `cd server/` 和根目录操作即可。

### D4: 数据库路径保持相对路径

**选择**: `sqlite:///./dev.db`（相对于 `server/` 工作目录）
**理由**: 后端启动命令在 `server/` 目录下执行（`uv run uvicorn`），所以相对路径自然指向 `server/dev.db`。无需修改 `config.py`。

### D5: 不修改 CORS 配置

**选择**: 保持现有 CORS 配置不变
**理由**: 后端已配置允许 `localhost:5173` 和 `127.0.0.1:5173`，合并后前端开发服务器地址不变，无需调整。

### D6: 清理迁移产物

**选择**: 不复制 `__pycache__/`、`dev.db` 等运行时产物
**理由**: 这些是本地运行产生的，应通过 `.gitignore` 排除，不应进入版本控制。

## Risks / Trade-offs

- **Alembic 配置路径**：`alembic.ini` 的 `prepend_sys_path = .` 和 `migrations/env.py` 的 `from app.database import Base` 依赖工作目录为 `server/`。需确保迁移命令在 `server/` 下执行。→ 迁移时 `cd server/ && uv run alembic upgrade head`

- **原仓库清理**：合并后原 `my_website_api` 仓库变为冗余。→ 由用户自行决定是否删除，不自动操作。

- **`.env` 文件**：后端 `config.py` 使用 `env_file = ".env"`，合并后 `.env` 应位于 `server/` 目录。→ 在 `.gitignore` 中添加 `server/.env`。
