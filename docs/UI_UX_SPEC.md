# UI_UX_SPEC — 产品信息架构与交互

## 1. 设计原则

1. **先给结论，再允许深挖**：普通玩家首先看到 DPS/TTD 和差值，高级玩家展开 Timeline/公式。
2. **Theory 与 Meta 视觉隔离**：不要把理论排名和平均名次放在同一排行榜列里造成误读。
3. **所有最优结论显示条件**：如 `10s / 100 Armor / 2★ / 4 Trait`。
4. **变化优先于绝对值**：装备比较时突出 `+4.4% DPS`，同时保留绝对数值。
5. **Accuracy 可见**：近似计算不藏在 tooltip 深处。

## 2. 顶部导航

MVP：

```text
Logo | Champions | Items | Traits | Lab | About
```

接入大数据后：

```text
Logo | Meta | Champions | Items | Traits | Lab | Comps | About
```

## 3. Home

Hero 不做“版本阵容榜”，核心入口：

```text
选择棋子 → 进入 Champion Lab
```

主文案应强调：

> Build it. Calculate it. Compare it.

第二屏展示三张能力卡：Mechanics / Optimizer / Meta。

## 4. Champion Lab

Desktop 三栏：

```text
[Champion / Traits] [Items / Enemy] [Results]
```

移动端按 Input → Result → Compare 顺序折叠。

### 左侧

- Champion selector
- Star selector
- Role badges
- Trait controls
- Base/resolved stats

### 中间

- 3 item slots
- enemy HP
- enemy Armor slider + numeric input
- enemy MR slider + numeric input
- duration segmented control
- advanced settings

### 右侧

Primary metric card：`10s DPS` 或 `TTD`。

Secondary：

- total damage
- first cast
- casts
- attacks
- physical/magic/true split

下方 Damage Breakdown chart。

## 5. Build Compare

允许锁两件装备并扫描第三件；也允许完全自定义 A/B/C/D 四组。

表格：

| Build | 5s | 10s | 15s | First Cast | Δ vs baseline |
|---|---:|---:|---:|---:|---:|

点击某行展开来源拆分。

## 6. Parameter Sweep

横轴 Armor/MR/Time，纵轴 DPS/TTD。

必须显示交点：

```text
Break-even Armor ≈ 117
```

用户 hover 时看到两组 Build 的具体数值。

## 7. Tank Lab

默认 metric 切换：

```text
Physical EHP | Magic EHP | Mixed TTD
```

展示“当前防御结构”：

```text
HP        High
Shield    High
Armor     Low
MR        Low
```

这只是数据摘要，推荐原因仍由实际 marginal gain 产生。

## 8. Accuracy Banner

三等级：

```text
Exact / High confidence
Approximate
Unsupported mechanics present
```

展开后列出：

- 哪些规则精确
- 哪些使用近似
- 哪些没有建模

## 9. Theory vs Meta

页面明确分区：

```text
THEORY
10s DPS / EHP / TTD

META
Games / Avg Placement / Top4 / Win / Play Rate
```

绝不把“理论最高 DPS”和“Meta 最佳平均名次”合并成一个没有解释的总评分。

## 10. Champion Detail

结构：

```text
Header + patch
Stats
Ability
Traits
Theory Lab mini panel
Meta statistics
Common builds
Patch history
```

## 11. Item Detail

展示：

- 当前 Patch 属性
- Effect 解析
- Trigger / stacks / duration
- 哪些 Champion 理论收益较高（场景化）
- Meta usage
- Patch history

## 12. URL / 分享

Lab state 最好可以序列化：

```text
/lab?patch=18.3b&unit=...&star=2&i=...&armor=100&mr=100&t=10
```

若 URL 太长则保存为 immutable share snapshot。

## 13. 空状态

Unsupported 棋子不显示 0 DPS，而应：

> 当前技能机制尚未完整支持；基础普攻部分可计算，技能部分未计入。

## 14. 颜色语义

不依赖颜色单独表达：

- 正收益：箭头 + 数字
- 负收益：箭头 + 数字
- Approximate：icon + 文本

需兼容色觉障碍。
