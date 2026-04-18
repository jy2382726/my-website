## ADDED Requirements

### Requirement: Monorepo 目录结构
项目 SHALL 采用双目录 monorepo 结构：前端代码位于项目根目录，后端代码位于 `server/` 子目录。

#### Scenario: 目录结构验证
- **WHEN** 查看项目根目录
- **THEN** SHALL 包含 `server/` 目录，其中包含 `app/`、`migrations/`、`alembic.ini`、`pyproject.toml`、`uv.lock`

### Requirement: 后端配置独立性
后端 SHALL 保持独立的 Python 依赖管理和配置，不与前端构建流程耦合。

#### Scenario: 独立安装后端依赖
- **WHEN** 在 `server/` 目录下执行 `uv sync`
- **THEN** SHALL 成功创建虚拟环境并安装所有 Python 依赖

#### Scenario: 独立运行后端服务
- **WHEN** 在 `server/` 目录下执行 `uv run uvicorn app.main:app --port 3002 --reload`
- **THEN** SHALL 成功启动 FastAPI 服务，`/api/health` 返回 `{"status": "ok"}`

### Requirement: 前端开发代理不变
前端开发服务器 SHALL 继续通过 Vite proxy 将 `/api` 请求转发到后端 3002 端口。

#### Scenario: API 请求代理
- **WHEN** 前端发起 `/api/auth/login` 请求
- **THEN** Vite proxy SHALL 将请求转发到 `http://127.0.0.1:3002/api/auth/login`

### Requirement: Git 忽略规则完整
项目根目录 `.gitignore` SHALL 同时覆盖前端和后端的忽略规则。

#### Scenario: Python 缓存被忽略
- **WHEN** 后端代码产生 `__pycache__/` 目录或 `.pyc` 文件
- **THEN** Git SHALL 忽略这些文件

#### Scenario: 数据库文件被忽略
- **WHEN** 后端产生 `dev.db` 文件
- **THEN** Git SHALL 忽略此文件
