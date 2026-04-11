## ADDED Requirements

### Requirement: Hero 区域展示开发者身份信息
Hero 区域 SHALL 展示开发者姓名（大号标题）、一句话定位描述，以及两个 CTA 按钮：「联系我」和「查看项目」。

#### Scenario: 正常加载展示
- **GIVEN** 用户访问网站首页
- **WHEN** 页面加载完成
- **THEN** Hero 区域显示开发者姓名、定位语、两个 CTA 按钮，内容完整可见

#### Scenario: CTA 按钮导航
- **GIVEN** Hero 区域已渲染
- **WHEN** 用户点击「查看项目」按钮
- **THEN** 页面平滑滚动到项目展示区块

#### Scenario: 联系我按钮
- **GIVEN** Hero 区域已渲染
- **WHEN** 用户点击「联系我」按钮
- **THEN** 打开 mailto 链接（占位邮箱）

### Requirement: Hero 区域包含 2D Canvas 粒子背景
Hero 区域 SHALL 包含一个 2D Canvas 粒子动画作为背景，粒子缓慢飘动，距离较近的粒子之间画连线。粒子颜色跟随当前主题的 accent 色（半透明）。

#### Scenario: 桌面端粒子动画
- **GIVEN** 用户在桌面端浏览器访问
- **WHEN** Hero 区域进入视口
- **THEN** Canvas 渲染约 80 个粒子，粒子飘动且有连线效果

#### Scenario: 移动端粒子降级
- **GIVEN** 用户在移动端设备访问（屏幕宽度 < 768px）
- **WHEN** Hero 区域进入视口
- **THEN** Canvas 渲染约 30 个粒子，动画仍然流畅

#### Scenario: 离开视口暂停动画
- **GIVEN** 粒子动画正在运行
- **WHEN** 用户滚动页面使 Hero 区域完全离开视口
- **THEN** 粒子动画暂停以节省性能

#### Scenario: Canvas 初始化失败降级
- **GIVEN** 浏览器不支持 Canvas API
- **WHEN** 页面加载
- **THEN** Hero 区域正常显示文本内容和按钮，仅粒子背景缺失，不影响页面可用性
