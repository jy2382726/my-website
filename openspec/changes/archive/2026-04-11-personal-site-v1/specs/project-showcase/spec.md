## ADDED Requirements

### Requirement: 项目展示区块以卡片网格展示项目
项目展示区块 SHALL 以响应式卡片网格展示项目列表，每张卡片包含项目截图、名称、描述和技术标签。

#### Scenario: 桌面端三列布局
- **GIVEN** 用户在桌面端访问（屏幕宽度 >= 1024px）
- **WHEN** 项目展示区块渲染
- **THEN** 卡片以最多 3 列网格排列

#### Scenario: 平板端两列布局
- **GIVEN** 用户在平板端访问（768px <= 屏幕宽度 < 1024px）
- **WHEN** 项目展示区块渲染
- **THEN** 卡片以 2 列网格排列

#### Scenario: 移动端单列布局
- **GIVEN** 用户在移动端访问（屏幕宽度 < 768px）
- **WHEN** 项目展示区块渲染
- **THEN** 卡片以单列排列，宽度撑满容器

#### Scenario: 卡片内容完整展示
- **GIVEN** 项目数据包含截图、名称、描述和技术标签
- **WHEN** 项目卡片渲染
- **THEN** 卡片显示项目截图（顶部）、名称（标题）、描述（正文）和技术标签（底部标签列表）

### Requirement: 项目卡片支持 hover 微动效
项目卡片在鼠标悬停时 SHALL 展示微动效：边框发光（accent 色）和轻微上浮。

#### Scenario: 桌面端 hover 效果
- **GIVEN** 用户在桌面端浏览器
- **WHEN** 鼠标悬停在项目卡片上
- **THEN** 卡片边框出现 accent 色发光效果，卡片轻微上浮（translateY），过渡动画平滑

#### Scenario: 移动端无 hover
- **GIVEN** 用户在触摸设备上
- **WHEN** 浏览项目卡片
- **THEN** 卡片无 hover 动效，正常展示，不影响可用性

### Requirement: 项目数据从 TypeScript 数据源读取
项目数据 SHALL 从 `src/data/projects.ts` 文件读取，数据结构包含项目名称、描述、技术标签、截图路径和可选的外部链接。

#### Scenario: 正常数据渲染
- **GIVEN** projects.ts 中定义了 3 个项目
- **WHEN** 项目展示区块渲染
- **THEN** 显示 3 张项目卡片，每张内容与数据一致

#### Scenario: 项目列表为空
- **GIVEN** projects.ts 中项目数组为空
- **WHEN** 项目展示区块渲染
- **THEN** 显示友好的空状态提示（如「暂无项目」），不报错

#### Scenario: 图片懒加载
- **GIVEN** 项目卡片包含截图
- **WHEN** 卡片在视口外时
- **THEN** 图片不加载；进入视口后才发起图片请求
