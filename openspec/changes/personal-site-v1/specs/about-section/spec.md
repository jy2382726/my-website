## ADDED Requirements

### Requirement: 关于我区块展示个人介绍
关于我区块 SHALL 展示一段简短的自我介绍文案，以及技术栈标签列表。

#### Scenario: 正常展示
- **GIVEN** 用户滚动到关于我区块
- **WHEN** 区块进入视口
- **THEN** 显示自我介绍文案和技术栈标签，文案可读性良好

#### Scenario: 技术栈标签展示
- **GIVEN** 关于我区块已渲染
- **WHEN** 技术栈标签区域加载完成
- **THEN** 以标签/chip 形式展示技术名称（如 React、TypeScript、Node.js 等），标签样式统一

### Requirement: 关于我区块内容数据化
自我介绍文案和技术栈列表 SHALL 从数据源中读取，便于后续修改。

#### Scenario: 数据驱动渲染
- **GIVEN** 数据源中定义了介绍文案和技术栈
- **WHEN** 组件渲染
- **THEN** 展示的内容与数据源一致

#### Scenario: 数据为空时的降级
- **GIVEN** 数据源中技术栈列表为空
- **WHEN** 组件渲染
- **THEN** 技术栈标签区域不显示，不影响其他内容
