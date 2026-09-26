# CALCULATION_RULES — TFT Mechanics Engine

> Version: v0.1  
> Reference patch: 18.3  
> 核心原则：不猜规则；所有规则必须有版本、来源、状态和测试。

## 1. Rule Status

每条规则必须有：

```text
VERIFIED_OFFICIAL   Riot 官方明确说明
VERIFIED_DATA       当前客户端/CommunityDragon 数据可确认
VERIFIED_TEST       控制变量实测确认
VERIFIED_SECONDARY  高质量二手资料，尚未完全实测
PARTIAL             部分实现
ASSUMED             暂时假设
UNKNOWN             未知
UNSUPPORTED         引擎当前不支持
```

结果必须携带 `AccuracyReport`，任何 `ASSUMED/PARTIAL/UNSUPPORTED` 都不能静默忽略。

## 2. Source Priority

建议优先级：

```text
当前版本控制变量实测
≈ 当前客户端真实数据
> 当前 Riot 官方说明
> CommunityDragon 结构化数据
> Riot Data Dragon
> 高质量社区资料
> 推测
```

## 3. Patch Isolation

所有数据和规则都绑定：

```yaml
set: 18
patch: "18.3"
hotfix: "B"
data_revision: "18.3-B.1"
rules_revision: "2026-09-27.1"
```

禁止跨 Patch 混用。

## 4. Simulation Context

```ts
type SimulationContext = {
  patchRevision: string;
  championId: string;
  starLevel: 1 | 2 | 3;
  traitStates: TraitState[];
  items: string[];
  augments?: string[];
  enemy: EnemyProfile;
  durationSec: number;
  rngMode: 'EXPECTED' | 'SEEDED_RANDOM';
};
```

MVP 默认单棋子对静止 Dummy。

## 5. Core Stats

统一命名：

```text
HP, AD, AP, ATTACK_SPEED, ARMOR, MR,
CRIT_CHANCE, CRIT_MULTIPLIER,
DAMAGE_AMP, DAMAGE_REDUCTION,
MANA, MAX_MANA, MANA_REGEN,
ATTACK_MANA, OMNIVAMP, ATTACK_RANGE
```

动态状态：

```text
SHIELD
ARMOR_SHRED
ARMOR_PEN_PERCENT
ARMOR_PEN_FLAT
MR_SHRED
MR_PEN_PERCENT
MR_PEN_FLAT
ATTACK_SPEED_SLOW
DOT
```

## 6. Stat Resolution Phases

最终属性按阶段解析：

```text
BASE_CHAMPION
→ STAR_LEVEL
→ STATIC_CHAMPION_MODIFIERS
→ TRAIT_STATIC
→ ITEM_STATIC
→ AUGMENT_STATIC
→ START_OF_COMBAT
→ DYNAMIC_COMBAT
→ TEMPORARY_BUFF_DEBUFF
```

禁止把所有增益简单塞进一个 `stats` 字典相加。

## 7. Damage Model

DamageEvent：

```ts
type DamageEvent = {
  sourceId: string;
  targetId: string;
  type: 'PHYSICAL' | 'MAGIC' | 'TRUE';
  rawAmount: number;
  canCrit: boolean;
  tags: string[];
  timestamp: number;
};
```

常用 tags：

```text
BASIC_ATTACK, ABILITY, ITEM, TRAIT, DOT, AOE, ON_HIT, SECONDARY
```

### 推荐伤害流水线

```text
Base/Scaling
→ Source modifiers
→ Conditional modifiers
→ Crit
→ Resistance / Penetration
→ Target-side modifiers
→ Final Damage
→ Shield
→ HP
→ Death Check
```

所有伤害必须经过 `DamageResolver`。

## 8. Physical / Magic Resistance

正 Armor 的基础模型：

```text
physical_multiplier = 100 / (100 + armor)
```

正 MR 同理：

```text
magic_multiplier = 100 / (100 + mr)
```

因此纯物理静态 EHP：

```text
PhysicalEHP = HP × (1 + Armor / 100)
```

纯魔法：

```text
MagicEHP = HP × (1 + MR / 100)
```

> 当前项目必须把正抗性公式列为需要当前版本实测确认的 Golden Rule。负 Armor/MR 不得直接套用 LoL PC 公式。

## 9. Penetration / Shred

内部严格区分：

```text
ARMOR_SHRED
ARMOR_PEN_PERCENT
ARMOR_PEN_FLAT
MR_SHRED
MR_PEN_PERCENT
MR_PEN_FLAT
```

顺序、同类叠加和持续时间必须由当前 Patch Rule Registry 决定。MVP 不允许把 Reduction/Shred/Pen 视为同一个字段。

## 10. Basic Attack

理论 raw AA：

```text
RawAttackDamage = CurrentAD
```

技能强化普攻可增加 multiplier 或 flat term。

Attack Speed 的含义：每秒攻击次数；理论间隔：

```text
attack_interval = 1 / attack_speed
```

但实际攻击数由 Timeline 决定，因为施法、控制、移动、动画、目标丢失等会中断攻击。

Attack Speed cap 必须来自版本规则，不能散落硬编码。

## 11. Ability Scaling

技能统一拆成 scaling terms：

```text
raw = flat
    + AD × ad_ratio
    + AP × ap_ratio
    + MaxHP × self_max_hp_ratio
    + TargetMaxHP × target_max_hp_ratio
    + ...
```

星级数值应直接读取每星级 effect values，不假设统一倍数。

## 12. Crit

必须分开：

```text
CRIT_CHANCE
CRIT_MULTIPLIER
```

Theory 默认使用期望值模式：

```text
ExpectedCritMultiplier = (1-p) + p×m
```

`p` 为暴击概率，`m` 为暴击伤害倍率。

同时保留 `SEEDED_RANDOM` 用于 Monte Carlo/分布测试，但普通 Build Compare 默认 EXPECTED，确保公平可复现。

技能是否可暴击必须由 ability/effect 决定。

## 13. Damage Amp / Reduction

内部统一 Effect 类型，但不默认所有来源加算或乘算。

```ts
Modifier {
  sourceId: string;
  value: number;
  stackingGroup: string;
  stackingMode: 'ADD'|'MULTIPLY'|'MAX'|'REPLACE';
}
```

同样适用于 Durability / Damage Reduction。

## 14. Role & Mana

从 K.O. Coliseum 起，旧的“所有单位普攻固定 +10 Mana 且所有单位受伤回蓝”不再适合作为统一基础规则。

当前官方 Role 基线需要在规则库建模：

- Tank：每次攻击 5 Mana；通过承受伤害获得 Mana。
- Fighter：每次攻击 10 Mana。
- Assassin：每次攻击 10 Mana。
- Marksman：每次攻击 10 Mana。
- Caster：每次攻击 7 Mana；基础 2 Mana Regen/s。
- Specialist：资源规则可能是 Champion-specific。

`Mana Regen` 表示每秒 Mana。

总 Mana 来源需要保留来源标签：

```text
STARTING_MANA
ATTACK_MANA
MANA_REGEN
DAMAGE_TAKEN_MANA
ITEM_MANA
TRAIT_MANA
ABILITY_MANA
AUGMENT_MANA
```

### Timeline

回蓝不是一个简单 `mana_needed / mana_per_second` 公式，而是离散事件：

```text
0.00 start
0.72 attack → +7
1.00 regen tick/continuous accrual
1.44 attack → +7
...
FULL_MANA
CAST_REQUEST
CAST_START
CAST_HIT
```

Tank 的 damage-taken Mana 公式必须单独验证；未知时 Cast Timing 标记 Approximate。

## 15. Cast / Mana Lock

必须分开：

```text
FULL_MANA
CAST_REQUEST
CAST_START
CAST_HIT
CAST_END
```

满蓝不等于伤害瞬时发生。

每个 Ability 可以定义：

```yaml
cast_time: number | UNKNOWN
mana_lock: number | UNKNOWN
projectile_travel: number | UNKNOWN
channel: optional
```

Mana overflow、Mana lock、动画期间是否回蓝等属于 Verification Backlog。

## 16. Shield

Shield 是独立 pool：

```ts
Shield {
  sourceId: string;
  amount: number;
  createdAt: number;
  expiresAt?: number;
  stackingMode: 'ADD'|'REPLACE'|'MAX'|'REFRESH';
}
```

最终伤害经过抗性后先打 Shield，再打 HP。

双抗能放大 HP 和 Shield 的有效承伤，因此 Build Optimizer 必须比较 HP 与 Resistance 的边际收益，而不是仅看 tooltip 数值。

## 17. Healing / Omnivamp

实际有效治疗：

```text
EffectiveHeal = min(RawHeal, MaxHP - CurrentHP)
Overheal = RawHeal - EffectiveHeal
```

TTD 只使用 Effective Heal。

Omnivamp：

```text
heal = eligible_damage × omnivamp
```

但 eligible damage 必须通过 `canOmnivamp` 或规则标签控制，不默认所有 Item/DoT/AOE 都完全生效。

## 18. EHP 与 TTD

EHP 用于静态近似；正式坦克排序优先使用 TTD。

Enemy profile：

```yaml
physical_dps: 700
magic_dps: 400
true_dps: 50
```

通过完整 Damage Resolver 输入 Tank Simulator，得到 death timestamp。

TTD 可以自然处理：

- Shield
- Heal
- Lifeline
- Temporary Resistance
- Damage Reduction
- Ability cast
- Periodic effects

## 19. Item / Trait / Ability Effects

禁止业务代码：

```ts
if (item.name === 'SomeItem') { ... }
```

应标准化为 Effects：

```yaml
trigger: ON_ATTACK
action:
  type: STAT_MODIFIER
  stat: ATTACK_SPEED
  operation: ADD_PERCENT
  value: 0.05
stacking:
  mode: ADD
  max: 20
duration: COMBAT
```

Trait、Item、Ability 共享 Effect Runtime。只有无法泛化的棋子使用 `ChampionMechanicPlugin`。

## 20. Trigger Types

MVP：

```text
COMBAT_START
TIME
ON_ATTACK
ON_HIT
ON_DAMAGE
ON_PHYSICAL_DAMAGE
ON_MAGIC_DAMAGE
ON_CRIT
ON_CAST
POST_CAST
ON_DAMAGE_TAKEN
ON_SHIELD
ON_HEAL
ON_KILL
ON_DEATH
HP_THRESHOLD
STACK_THRESHOLD
```

## 21. Event-driven Simulator

使用 Priority Queue，而非固定帧 tick：

```ts
CombatEvent {
  timestamp: number;
  priority: number;
  type: string;
  sourceId: string;
  targetId?: string;
  payload: unknown;
}
```

时间轴只跳到真实事件：0.000 → 0.723 → 1.000 → 1.411...

同 timestamp 事件顺序必须有 `EventPrioritySpec` 并逐步通过实测确认。

## 22. Stack / Periodic / Lifeline

统一运行时：

```ts
StackState { current, max, expiresAt?, refreshPolicy }
```

Periodic 直接创建未来事件（如 4/8/12/16s），不靠循环轮询。

Lifeline 使用 `HP_THRESHOLD + maxTriggers=1`。

## 23. DPS / Burst

```text
DPS(t) = TotalDamage(0..t) / t
Burst5 = TotalDamage(0..5s)
```

必须提供 breakdown：AA / Ability / Item / Trait + Physical / Magic / True。

## 24. Build Compare

两个 Build 只有在以下完全相同时才能计算 Δ%：

```text
Patch
Champion
Star
Traits
Enemy
Duration
RNG Mode
```

```text
Delta = NewMetric / BaseMetric - 1
```

## 25. Break-even Analysis

对 Armor/MR/HP/Time 进行 parameter sweep：

```text
DPS_A(x)
DPS_B(x)
```

寻找交点并展示：

> 当 Armor 高于约 X 时，Build B 的理论 DPS 开始超过 Build A。

这是核心产品能力之一。

## 26. Optimizer

合法装备集合 N，枚举三件组合 `C(N,3)`；对每个 Build 使用相同 context simulation。

指标：

- 5s Burst
- 10/15/20s DPS
- First Cast
- Physical EHP
- Magic EHP
- Mixed TTD

禁止一个全局 `best_item=true`。

## 27. AOE / Positioning / Targeting

MVP：Single Target。

AOE 可以分别记录 `primary_target_damage` 与 `total_board_damage`，但在没有几何和目标模型时不得假装是完整团战模拟。

Positioning、Pathing、Aggro、Target switching、CC chain、Multiple enemy AI 标记 `UNSUPPORTED`，留到 Battlefield Engine。

## 28. Numerical Policy

内部：double precision；百分比统一 0~1；时间统一秒；中间过程不 round；UI 层格式化。

## 29. Standard Result

```ts
SimulationResult {
  totalDamage;
  dps;
  basicAttackDamage;
  abilityDamage;
  itemDamage;
  traitDamage;
  physicalDamage;
  magicDamage;
  trueDamage;
  attacks;
  casts;
  firstCastTime;
  shieldGenerated;
  effectiveHealing;
  damageTaken;
  deathTime;
  timeline;
  accuracyReport;
}
```

## 30. Verification Backlog

必须逐项验证：

- 当前 Attack Speed Cap
- Negative Armor/MR
- Shred / Pen 顺序
- 同类 Shred stacking
- Damage Amp stacking
- Damage Reduction stacking
- Crit cap / excess conversion
- Spell Crit
- Tank damage-taken Mana
- Mana overflow
- Mana lock
- Shield stacking/expiry
- Heal modifiers
- Omnivamp eligibility
- Same-frame trigger order
- Attack animation
- Cast animation
- Projectile timing
- Snapshot vs dynamic scaling

## 31. Engine 修改硬约束

1. 不猜机制。
2. 不硬编码 Patch 数值。
3. 不按装备中文名堆 if/else。
4. Effect system 优先于 custom code。
5. 每条 rule 可追踪来源。
6. 每条 rule 有 patch range。
7. Approximate/Unsupported 必须进入结果。
8. Theory 不读取 Meta 统计作为计算输入。
9. 同 context 结果可复现。
10. “最优”必须绑定场景和 metric。
