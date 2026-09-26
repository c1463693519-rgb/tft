# PATCH_UPDATE_RUNBOOK — 版本更新 SOP

## 0. 目标

新 Patch/B Patch 到来后，不直接覆盖线上数据，而是创建 draft revision，经 diff + review + regression 后再切换 active。

## 1. Detect

- Riot Patch Notes 发布
- CommunityDragon 新版本可用
- Data Dragon 版本变化（如已同步）

创建：`patch_revision = draft`。

## 2. Snapshot

下载并 hash：

- CDragon raw
- DDragon raw（可用时）
- Patch Notes

保存到 object storage。

## 3. Normalize

使用固定 parser version 生成 normalized records。

## 4. Diff

报告：

```text
Champion stat changes
Ability effect changes
Item changes
Trait changes
Role/resource changes
Unknown fields
```

## 5. Patch Notes Reconcile

把官方列出的变化与数据 diff 对齐：

- Notes changed + Data changed → expected
- Notes changed + Data unchanged → investigate
- Data changed + Notes absent → investigate/possible hidden/internal change

## 6. Mechanics Review

任何系统规则变化必须产生 rule revision；不能只改 tooltip。

## 7. Regression

运行：

```text
unit
runtime
engine scenarios
golden champions
API contract
```

## 8. Manual Verification

只对：

- 新机制
- 高影响规则
- diff 异常
- 失败 Golden cases

做游戏内控制测试。

## 9. Promote

必须记录：

```text
active data revision
active rules revision
engine version
known approximations
known unsupported mechanics
```

## 10. B Patch

B Patch 视为独立 revision，而不是编辑原 revision。

例如：

```text
18.3-A (archived)
18.3-B (active)
```

这样历史分享链接仍可复现。

## 11. Rollback

若新 revision 出现严重错误，只切 active pointer 回旧 revision；不删除错误 revision，保留审计。
