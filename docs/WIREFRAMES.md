# WIREFRAMES — 低保真页面原型

## 1. Home

```text
┌──────────────────────────────────────────────────────────────────┐
│ LOGO      Champions  Items  Traits  Lab                 Patch 18.3│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                BUILD IT. CALCULATE IT. COMPARE IT.              │
│                                                                  │
│       [ Search champion.............................. ] [Open Lab]│
│                                                                  │
│  精确机制计算 · 装备收益比较 · 真实对局统计                     │
│                                                                  │
├───────────────────┬───────────────────┬──────────────────────────┤
│ Mechanics Engine  │ Build Optimizer   │ Meta Statistics          │
│ 算 DPS / TTD      │ 枚举装备组合      │ 出场率/名次/样本量       │
└───────────────────┴───────────────────┴──────────────────────────┘
```

## 2. Champion Lab

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← Champions     Aphelios-like ADC     2★      Patch 18.3B      Accuracy: HIGH │
├──────────────────────┬───────────────────────┬───────────────────────────────┤
│ CHAMPION             │ BUILD / TARGET        │ RESULT                        │
│                      │                       │                               │
│ [portrait]           │ Items                 │ 10s DPS                       │
│ HP     1650          │ [Guinsoo]             │ 1,339                         │
│ AD       98          │ [Infinity Edge]       │ +4.4% vs baseline             │
│ AS     0.80          │ [Deathblade]          │                               │
│ Armor    30          │                       │ Total Damage 13,390           │
│ MR       30          │ Enemy                 │ Attacks 12.4 expected         │
│                      │ HP     [3000]          │ Casts   2                     │
│ Traits               │ Armor  [====100===]   │ First cast 4.31s              │
│ [4 X] [2 Y]          │ MR     [====100===]   │                               │
│                      │                       │ [Damage breakdown chart]      │
│ [Advanced stats]     │ Duration 5 10 15 20   │                               │
├──────────────────────┴───────────────────────┴───────────────────────────────┤
│ Compare builds                                                               │
│ Baseline: Rageblade + IE + LW                                                │
│ B:        Rageblade + IE + Deathblade       1,339 DPS      +4.4%             │
│ C:        Rageblade + IE + Giant Slayer     1,304 DPS      +1.7%             │
├──────────────────────────────────────────────────────────────────────────────┤
│ Parameter sweep: Armor                                                       │
│ DPS                                                                          │
│ 1500 ─ A───────                                                             │
│ 1300      ╲   B────                                                         │
│ 1100 ──────╳────────────                                                     │
│            ↑ break-even ≈ 117 Armor                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 3. Tank Lab

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Tank Champion | 2★ | Trait 6X | Enemy profile: 60P / 35M / 5T       │
├──────────────────────────┬───────────────────────────────────────────┤
│ Current structure        │ Equipment marginal gain                  │
│ HP       █████████  High │ Gargoyle        TTD +31%                 │
│ Shield   ████████   High │ Warmog           TTD +14%                 │
│ Armor    ███        Low  │ Dragon's Claw    TTD +20%                 │
│ MR       ███        Low  │                                           │
├──────────────────────────┼───────────────────────────────────────────┤
│ Physical EHP  9,240      │ Death time                                │
│ Magic EHP     8,770      │ Base        10.0s                         │
│ Mixed TTD     13.1s      │ Gargoyle    13.1s                         │
└──────────────────────────┴───────────────────────────────────────────┘
```

## 4. Champion Detail

```text
[Portrait] NAME  Cost | Role | Traits | Patch
-------------------------------------------------
Stats               | Ability
HP / AD / AS / ...  | structured scaling + text
-------------------------------------------------
Open in Lab
-------------------------------------------------
Theory snapshot      | Meta snapshot
10s DPS              | N games
Common theory build  | Avg placement / Top4
-------------------------------------------------
Patch history
```

## 5. Theory vs Meta

```text
┌───────────────────────────┬────────────────────────────────┐
│ THEORY                    │ META                           │
│ Scenario: 100 Armor, 10s  │ Filter: Master+, current patch│
├───────────────────────────┼────────────────────────────────┤
│ Build A  1,339 DPS        │ Build A N=31k Avg=3.94        │
│ Build B  1,282 DPS        │ Build B N=52k Avg=3.81        │
├───────────────────────────┴────────────────────────────────┤
│ Explanation                                                    │
│ • A has higher personal single-target theoretical DPS.         │
│ • B has better observed placement in this filtered sample.     │
│ • Meta is observational and may reflect team utility/context.  │
└─────────────────────────────────────────────────────────────────┘
```

## 6. Admin Patch Review

```text
Patch 18.4 Draft
-------------------------------------------------
Static Diff
Champions changed  12
Items changed       4
Traits changed      7
Unknown fields      3
-------------------------------------------------
Mechanics requiring review
[ ] Mana behavior changed
[ ] Item X stacking
[ ] Champion Y cast timing
-------------------------------------------------
Regression
PASS 812 / FAIL 4 / SKIP 17
[Promote patch] disabled until required failures resolved
```
