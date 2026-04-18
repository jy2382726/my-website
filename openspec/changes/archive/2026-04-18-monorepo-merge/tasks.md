## 1. 后端代码迁移

- [x] 1.1 创建 `server/` 目录，将 `my_website_api/` 下所有源代码复制到 `server/`（排除 `__pycache__/`、`dev.db`、`.venv/`）
- [x] 1.2 验证 `server/app/`、`server/migrations/`、`server/alembic.ini`、`server/pyproject.toml`、`server/uv.lock` 结构完整

## 2. 项目配置调整

- [x] 2.1 更新根目录 `.gitignore`，补充 Python 相关忽略规则（`__pycache__/`、`*.pyc`、`server/dev.db`、`server/.env`、`server/.venv/`）
- [x] 2.2 确认 `vite.config.ts` proxy 配置无需修改（已指向 `127.0.0.1:3002`）
- [x] 2.3 确认 `server/app/config.py` 数据库路径 `sqlite:///./dev.db` 在 `server/` 工作目录下正确

## 3. 安装与启动验证

- [x] 3.1 在 `server/` 下执行 `uv sync`，确认 Python 依赖安装成功
- [x] 3.2 在 `server/` 下执行 `uv run alembic upgrade head`，确认迁移执行成功，`server/dev.db` 已创建
- [x] 3.3 启动后端 `uv run uvicorn app.main:app --port 3002 --reload`，确认 `/api/health` 返回 `{"status": "ok"}`
- [x] 3.4 启动前端 `npm run dev`，确认 Vite proxy 正常转发 API 请求
- [x] 3.5 **端到端验证**：注册 → 登录 → 浏览课程 → 注册课程 → 进入学习页 → AI 对话 → Admin 管理
