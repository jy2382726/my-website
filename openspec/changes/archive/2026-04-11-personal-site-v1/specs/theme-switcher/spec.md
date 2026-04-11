## ADDED Requirements

### Requirement: 支持亮色/暗色主题切换
站点 SHALL 支持亮色和暗色两种主题，用户可通过导航栏的主题切换按钮手动切换。切换时所有组件的颜色同步变化。

#### Scenario: 首次访问跟随系统偏好
- **GIVEN** 用户首次访问站点，未设置过主题偏好
- **WHEN** 页面加载
- **THEN** 主题跟随系统偏好（prefers-color-scheme），若系统为暗色则显示暗色主题

#### Scenario: 手动切换主题
- **GIVEN** 当前为暗色主题
- **WHEN** 用户点击导航栏主题切换按钮
- **THEN** 切换为亮色主题，所有区块颜色同步变化，切换按钮图标更新

#### Scenario: 主题偏好持久化
- **GIVEN** 用户手动选择了暗色主题
- **WHEN** 用户关闭页面后再次访问
- **THEN** 站点显示暗色主题（从 localStorage 读取偏好）

#### Scenario: 主题切换动画
- **GIVEN** 站点正在展示
- **WHEN** 用户切换主题
- **THEN** 颜色过渡平滑（CSS transition），无闪烁

### Requirement: 青绿色系配色方案
站点 SHALL 使用青绿色系（teal）作为主题色，具体色值由 CSS 变量定义，亮色和暗色主题各有适配。

#### Scenario: 暗色主题配色
- **GIVEN** 当前为暗色主题
- **WHEN** 页面渲染
- **THEN** 背景为深色（如 #0a0a0a），文字为浅色（如 #e5e5e5），accent 色为 teal-400（如 #2dd4bf）

#### Scenario: 亮色主题配色
- **GIVEN** 当前为亮色主题
- **WHEN** 页面渲染
- **THEN** 背景为浅色（如 #fafafa），文字为深色（如 #171717），accent 色为 teal-500（如 #14b8a6）

#### Scenario: Canvas 粒子跟随主题
- **GIVEN** Hero 区域粒子动画正在运行
- **WHEN** 用户切换主题
- **THEN** 粒子颜色同步更新为新主题的 accent 色
