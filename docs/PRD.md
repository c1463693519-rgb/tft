# PRD — TFT Mechanics & Data Platform

> Version: v0.1  
> Status: Product Baseline  
> Platform: Web-first  
> Product pillars: Mechanics Engine / Build Optimizer / Meta Statistics

## 1. 背景与机会

主流 TFT 网站擅长回答“这个棋子通常出什么”“平均名次如何”“这套阵容有多少出场率”。但只依赖统计数据，无法回答大量更接近游戏理解的问题：

- 两套三件装备在相同棋子、星级、羁绊和敌方抗性下，10 秒 DPS 到底差多少？
- 一套装备为什么在低护甲目标上更强，却在高护甲目标上反转？
- 当前坦克已经通过羁绊获得大量 HP、技能又产生护盾，此时继续堆 HP 还是补双抗收益更高？
- 理论个人 DPS 更高的装备，为什么真实对局平均名次反而更差？

本项目通过可执行战斗规则解决这些问题。

## 2. 产品愿景

长期目标是建立一套可版本化、可解释、可验证的 TFT Mechanics Model，使玩家能够把棋子、装备、羁绊和敌方属性作为输入，把 DPS、TTD、EHP、施法时间等作为输出。

最终形态：

```text
准确静态数据
    +
战斗机制模型
    +
真实对局大数据
    ↓
可解释的装备与构筑决策平台
```

## 3. 用户群体

### 3.1 高分段/竞技玩家

需要精确的装备边际收益、目标抗性阈值、战斗时间窗口和版本变化。

### 3.2 数据型玩家

愿意调整目标 HP/Armor/MR、战斗时长、星级、羁绊并查看公式或时间轴。

### 3.3 内容创作者

需要“为什么”而不仅是“结论”，并希望生成可分享的 Build 对比结果。

### 3.4 普通玩家

只希望选棋子并看到推荐组合、理论提升和简单解释。高级参数应可折叠。

## 4. 核心用户故事

### US-001 装备 DPS 对比

作为玩家，我选择一张棋子、星级、羁绊、敌方 Armor/MR 和三件装备，希望看到 5/10/15 秒的理论伤害和 DPS，并更换其中一件装备进行公平对比。

### US-002 护甲阈值

作为玩家，我比较轻语类破甲装备与纯 AD 装，希望看到在哪个 Armor 区间两者发生反转。

### US-003 坦克装备优化

作为玩家，我选择一个拥有高 HP 或护盾的前排，希望系统比较 HP 装与抗性装对 Physical EHP、Magic EHP 和 TTD 的提升。

### US-004 理论 vs 大数据

作为玩家，我希望同时看到一套装备的理论输出以及该装备组合的真实样本量、平均名次、Top4 和登顶率，但系统必须明确它们是不同维度。

### US-005 版本复现

作为研究玩家，我希望切换 Patch 并复现旧版本结果，而不是所有数据都被最新版本覆盖。

## 5. 核心功能

### 5.1 Champion Database

展示基础属性、星级属性、技能、Role、羁绊、当前 Patch 变更和可计算覆盖率。

### 5.2 Item Database

展示基础 Stat、Effect、Trigger、持续时间、叠层、限制、理论收益和 Meta 使用数据。

### 5.3 Trait Database

展示 breakpoint、Effect、受益对象和对最终属性的贡献。

### 5.4 Champion Lab

输入：

- Patch
- Champion
- Star Level
- Traits
- Items × 3
- Enemy HP / Armor / MR
- Combat Duration
- RNG Mode

输出：

- Total Damage
- DPS @ 5/10/15/20s
- AA / Ability / Item / Trait damage breakdown
- Physical / Magic / True breakdown
- Attack count
- First cast / cast count
- Timeline（高级模式）
- Accuracy Report

### 5.5 Build Compare

同时比较 2~4 套 Build；所有对比共享相同 simulation context，并展示绝对值和相对变化。

### 5.6 Tank Lab

输出：

- Physical EHP
- Magic EHP
- Mixed TTD
- Shield generated
- Effective healing
- Death time
- Marginal gain by item

### 5.7 Build Optimizer

按场景枚举合法装备组合并按以下指标排序：

- Max 5s Burst
- Max 10/15s DPS
- Fastest First Cast
- Max Physical EHP
- Max Magic EHP
- Max Mixed TTD

禁止提供脱离场景的全局“Best”。

### 5.8 Meta Statistics

真实对局维度：

- Games
- Play Rate
- Avg Placement
- Top4 Rate
- Win Rate
- Item usage
- Item pair / triple usage
- Star level
- Rank / region / patch filters

所有统计必须显示 Sample Size。

### 5.9 Theory vs Meta

一套 Build 可同时展示：

```text
Theory: 10s DPS +8.3%
Meta: Avg Placement -0.18, N=42,183
```

解释层可指出相关因素，但必须把“观测相关性”和“机制计算”区分开。

## 6. MVP Scope

### 必须有

- 当前 Patch Static Data 导入
- Champion / Item / Trait 基础页面
- 4 类 Golden Champion 支持
- Single-target Combat Simulator
- 正 Armor/MR 减伤
- AD/AP/AS/Crit
- Role Mana / Mana Regen
- 基础 Damage Amp
- 基础 Shield / Heal
- 一组 stacking item
- Champion Lab
- Build Compare
- Tank 静态 EHP
- Accuracy Report

### 暂不做

- 完整 8v8 棋盘模拟
- 站位、寻路、仇恨
- 自动阵容生成
- 玩家战绩中心
- 社区/评论
- 账号系统（除非保存 Build 必须）
- AI 聊天作为核心功能

## 7. 非功能需求

### Accuracy

数值准确性优先于功能数量。未知规则宁可提示不支持。

### Determinism

相同 Patch + Context + RNG mode 必须产生可复现结果。

### Explainability

结果需要能拆出属性变化和伤害来源。

### Performance

目标：单次普通 simulation <100ms；单棋子全三件组合搜索后续优化至 <1s~2s。MVP 可以更慢。

### Version Safety

任何计算对象必须指向显式 Patch Revision。

## 8. 成功指标

MVP 不以 DAU 为首要指标，而看：

- Mechanics exact coverage
- Golden tests pass rate
- Simulation reproducibility
- 用户完成“更换装备并比较”的比例
- 用户修改 enemy Armor/MR 的比例
- Build share/export rate
- Approximate/Unsupported rule rate 的下降趋势

## 9. 产品风险

### 机制复杂度

复杂技能、AOE、目标选择、动画、同帧事件会增加误差。通过 capability level 和 Accuracy Report 管理。

### 数据延迟

官方 Data Dragon 可能延迟；静态数据使用多源 diff，不能单源盲信。

### Meta 偏差

平均名次受阵容强度、玩家水平、装备获取条件、星级和强化符文等混杂变量影响。不得包装成因果结论。

### 国服数据

Riot 公开 TFT Developer 路由不含中国大陆腾讯服，国服数据能力应单独立项，不进入 MVP 承诺。

## 10. MVP 验收场景

### 输出棋子

给定一张 2★ ADC：

- Build A：羊刀 + 无尽 + 轻语
- Build B：羊刀 + 无尽 + 纯 AD 装
- Enemy：3000 HP / 100 Armor / 100 MR

系统输出 5/10/15s DPS、damage breakdown、攻击次数、施法次数，并计算 Build B 相对 Build A 的百分比差异。

将 Armor 调为 200 后，系统重新计算且允许发生排序变化。

### 坦克

给定高 HP + 技能护盾前排，比较 HP 装与双抗装，输出 Physical EHP / Magic EHP / Mixed TTD 的边际收益，且结论由计算结果生成而非手写推荐。
