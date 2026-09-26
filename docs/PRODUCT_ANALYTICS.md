# PRODUCT_ANALYTICS — 产品埋点

## 1. 为什么不只看 DAU

项目早期核心假设是“机制计算是否真的帮助玩家做装备决策”，因此行为漏斗比纯访问量更重要。

## 2. 核心事件

```text
lab_opened
champion_selected
star_changed
trait_changed
item_added
item_swapped
enemy_armor_changed
enemy_mr_changed
duration_changed
simulation_completed
comparison_added
sweep_opened
optimizer_run
accuracy_panel_opened
build_shared
meta_filter_changed
```

## 3. MVP 核心指标

### Lab Activation

进入 Lab 后成功完成至少一次 Simulation 的比例。

### Compare Rate

完成 Simulation 后更换装备或添加 Build Compare 的比例。

### Parameter Exploration Rate

修改 Armor/MR/Time 的比例；它能证明用户是否使用了项目的差异化能力。

### Share Rate

创建可分享 Build 的比例。

### Accuracy Engagement

展开 Accuracy Report 的用户比例，主要作为高级玩家需求指标。

## 4. Engine Quality Metrics

这些比产品 DAU 更重要：

- Exact rule coverage
- Unsupported rule count
- Golden pass rate
- Patch publish latency
- Meta freshness
- Simulation p95

## 5. Privacy

不要把完整 Riot player identity 与产品行为分析无必要地绑定。
