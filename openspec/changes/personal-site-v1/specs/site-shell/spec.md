## ADDED Requirements

### Requirement: 固定导航栏
站点 SHALL 包含固定在页面顶部的导航栏，包含站点名称/Logo、导航链接（关于、项目）和主题切换按钮。

#### Scenario: 导航栏固定展示
- **GIVEN** 用户访问任意页面区域
- **WHEN** 用户向下滚动
- **THEN** 导航栏始终固定在视口顶部，内容不遮挡

#### Scenario: 导航链接锚点跳转
- **GIVEN** 导航栏已渲染
- **WHEN** 用户点击「关于」链接
- **THEN** 页面平滑滚动到关于我区块

#### Scenario: 滚动时导航栏样式变化
- **GIVEN** 用户在页面顶部
- **WHEN** 用户开始向下滚动
- **THEN** 导航栏背景增加半透明模糊效果（backdrop-filter），与内容区分开

#### Scenario: 移动端导航栏适配
- **GIVEN** 用户在移动端访问（屏幕宽度 < 768px）
- **WHEN** 导航栏渲染
- **THEN** 导航栏适配移动端宽度，内容和按钮可正常点击，无溢出

### Requirement: Footer 展示联系信息
站点 SHALL 在页面底部包含 Footer 区域，展示占位联系邮箱。

#### Scenario: Footer 展示
- **GIVEN** 用户滚动到页面底部
- **WHEN** Footer 区域可见
- **THEN** 显示联系邮箱（占位：email@example.com），邮箱为 mailto 链接

#### Scenario: 邮箱链接点击
- **GIVEN** Footer 已渲染
- **WHEN** 用户点击邮箱链接
- **THEN** 打开默认邮件客户端，收件人为占位邮箱

### Requirement: 响应式页面布局
站点 SHALL 适配不同屏幕尺寸，内容区域有合理的最大宽度限制。

#### Scenario: 大屏居中布局
- **GIVEN** 用户在宽屏设备访问（> 1280px）
- **WHEN** 页面渲染
- **THEN** 内容区域居中显示，最大宽度限制（如 max-w-6xl），两侧留白

#### Scenario: 小屏自适应
- **GIVEN** 用户在小屏设备访问
- **WHEN** 页面渲染
- **THEN** 内容区域自适应屏幕宽度，保持合理内边距（px-4）
