# DATABASE_SCHEMA — PostgreSQL / ClickHouse / Redis

## 1. PostgreSQL 负责什么

- Patch revision
- normalized Champion/Item/Trait/Ability
- Effect definitions
- Mechanics rule registry
- source refs / verification
- saved build（未来）
- admin/import metadata

## 2. PostgreSQL 核心表

### patches

```sql
id uuid pk
game_version text
hotfix text null
set_number int
released_at timestamptz
data_revision text unique
rules_revision text
status text
created_at timestamptz
```

### champions

稳定 identity，不带 patch 数值。

```sql
id text pk
api_name text unique
name_key text
```

### champion_patch

```sql
champion_id fk
patch_id fk
cost smallint
role_damage_type text
role_team_type text
hp_star jsonb
ad_star jsonb
attack_speed numeric
armor numeric
mr numeric
crit_chance numeric
attack_range numeric
start_mana numeric
max_mana numeric
mana_regen numeric
ability_id text
support_level text
raw jsonb
primary key (champion_id, patch_id)
```

### items / item_patch

同样 identity 与 patch state 分离。

### traits / trait_patch / trait_breakpoints

Breakpoint 作为子实体。

### effects

```sql
id text
patch_id uuid
owner_type text
owner_id text
trigger jsonb
conditions jsonb
actions jsonb
stacking jsonb
duration jsonb
verification_status text
support_level text
primary key(id, patch_id)
```

### mechanics_rules

```sql
id text
valid_from_patch uuid
valid_to_patch uuid null
rule_type text
spec jsonb
verification_status text
notes text
```

### source_refs

```sql
id uuid
source_type text
url text null
raw_object_key text null
retrieved_at timestamptz
content_hash text
```

### rule_sources

many-to-many rule/effect → source refs。

## 3. JSONB 的使用边界

Effect AST、Trigger、Conditions 适合 JSONB；高频过滤维度和实体 identity 不要全部塞 JSONB。

## 4. ClickHouse

### matches

```text
patch_revision LowCardinality(String)
region LowCardinality(String)
match_id String
queue_id Int32
game_datetime DateTime
```

### participants

```text
match_id
player_hash
placement UInt8
rank_tier LowCardinality(String)
level UInt8
```

### participant_units

```text
match_id
player_hash
champion_id LowCardinality(String)
star UInt8
item_ids Array(String)
```

### participant_traits / augments

单独窄表或 Nested 类型，按实际查询性能决定。

## 5. ClickHouse 排序键

初期建议围绕：

```text
(patch_revision, region, champion_id, game_datetime)
```

真实 schema 需用代表性查询 benchmark 后再定。

## 6. 去重

Match ingestion 以 `region + match_id` 唯一；worker 必须幂等。

## 7. Redis

适用：

- API rate limiting
- hot meta query cache
- simulation result cache
- optimizer result cache
- distributed lock（patch import）

不作为 Source of Truth。

## 8. Migration 原则

Schema migration 与 Patch data import 是两件事：

- migration 改软件数据结构
- patch import 增加游戏版本数据

不要为每个 Riot Patch 创建 SQL migration。
