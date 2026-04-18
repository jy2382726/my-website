# CLAUDE.md — OpenSpec 工作流规则

## 核心纪律

1. **先读后做**：执行任何 OpenSpec 命令前，先读取：
   - openspec/config.yaml（项目约束）
   - openspec/specs/ 目录下相关域的规范（当前系统行为）
   - openspec/changes/ 当前活跃的变更（如果存在）

2. **不要猜测需求**：如果 spec 中没有明确定义某个行为，问我，不要自行补充。

3. **out-of-scope 是红线**：proposal.md 中标注为 out-of-scope 的功能，严禁实现。

## OpenSpec 协作规则

### 分阶段交互（防止错上加错）
在执行 /opsx:apply 时：
1. 每完成一个 phase 停下来
2. 总结当前阶段的变更（改了哪些文件、新增了什么）
3. 等待我 review 确认后再继续下一个 phase
4. 如果发现偏差，立即停止并说明问题

### 复用优先
- 优先使用已有组件和服务
- 新建文件前先搜索是否有可复用的
- 不创建重复的 utility 函数

### 命名一致性
- Change 用 domain-based naming（如 user-auth, ai-chat），不用 feature-level naming（如 add-sidebar, fix-layout）
- Spec 按业务域组织（如 ui/, auth/, ai/），每个域下按 capability 命名
- React 组件用 PascalCase
- API 端点用 kebab-case
- 数据库表用 snake_case

## 本地开发服务启动

项目为 monorepo 结构，前端在根目录，后端在 `server/` 目录。两个服务需分别启动：

```bash
# 后端（在 server/ 目录下）
cd server
uv run uvicorn app.main:app --port 3002 --reload

# 前端（在项目根目录）
npm run dev
```

- 后端 API：http://127.0.0.1:3002
- 前端页面：http://localhost:5173/my-website/
- Vite proxy 已配置 `/api` → `http://127.0.0.1:3002`
- 后端数据库：`server/dev.db`（SQLite，首次需执行 `cd server && uv run alembic upgrade head`）

## 代码标准

- 所有组件使用 TypeScript + 函数式组件
- 样式全部使用 Tailwind CSS，禁止内联 style
- 支持暗色模式（dark: 前缀）
- 所有图片使用 lazy loading
- 组件文件名使用 PascalCase
