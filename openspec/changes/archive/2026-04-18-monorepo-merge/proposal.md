## Why

后端代码（FastAPI + SQLite）目前位于独立仓库 `my_website_api`，每次开发需要同时打开两个终端、管理两套依赖和配置。合并为 monorepo 可以统一版本控制、简化启动流程，并为后续 CI/CD 和部署提供单一入口。

## What Changes

- 将 `my_website_api` 后端项目完整移入当前仓库的 `server/` 目录
- 保留后端的 Python 虚拟环境管理（uv），前端不变（npm/vite）
- 更新后端数据库路径和 Alembic 配置，使其相对于 `server/` 目录工作
- 更新 Vite proxy 配置指向合并后的后端端口
- 添加统一的 `dev` 启动脚本（同时启动前后端）
- 清理原 `my_website_api` 仓库中不需要的运行产物（`__pycache__`、`dev.db`）

## Capabilities

### New Capabilities

（无新增能力）

### Modified Capabilities

（无 spec 级别的需求变更 — 这是纯结构重构，不影响任何功能行为）

## Impact

- **目录结构**：新增 `server/` 目录，包含完整后端代码、Alembic 迁移、pyproject.toml
- **配置文件**：vite.config.ts（proxy 已指向 3002，无需修改）、alembic.ini（路径调整）、.gitignore（补充 Python 忽略规则）
- **开发流程**：从"开两个终端分别启动"变为"一个命令同时启动"
- **依赖**：无新依赖引入，仅位置迁移
- **API 契约**：零变更，所有端点路径和行为不变

## Out of Scope

- **不**修改任何 API 端点或数据模型
- **不**修改前端组件或页面逻辑
- **不**引入 monorepo 工具（Turborepo、Nx 等），保持简单双目录结构
- **不**修改 CORS 配置（后端已允许 localhost:5173）
- **不**配置 Docker 或容器化
- **不**删除原 `my_website_api` 仓库（用户自行决定何时清理）
