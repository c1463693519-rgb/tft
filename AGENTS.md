# AGENTS.md — Coding Agent 工作规范

## 1. 项目目标

本仓库实现 TFT Mechanics & Data Platform。准确性、版本可复现和可解释性优先于功能数量。

## 2. 开工前必须阅读

按任务相关性阅读：

1. `00_README.md`
2. `01_PRD.md`
3. `02_CALCULATION_RULES.md`
4. 对应模块设计文档
5. `14_DECISIONS.md`

## 3. 不允许做的事情

- 不猜 TFT 机制并写成确定代码。
- 不把当前 Patch 的棋子/装备数字硬编码进 Engine。
- 不按装备展示名称写大段 `if/else`。
- 不用 Meta 平均名次调整 Theory DPS。
- 不在未授权任务中重构无关模块。
- 不因为测试失败而删除测试或放宽 tolerance，除非有明确机制依据。
- 不自动 accept 全部 Golden snapshot changes。

## 4. Mechanics 变更要求

新增/修改 rule 必须同时提供：

```text
rule id
patch range
verification status
source/notes
unit test
```

如果未知：返回 Approximate/Unsupported，不编造。

## 5. 数据变更要求

Parser 必须：

- 对 raw fixtures 可重复运行
- 输出 deterministic
- 未识别字段记录 warning
- 不静默丢弃 effect variables

## 6. 测试要求

实现任务后只运行与任务相关的最小测试集合，再运行仓库定义的必需 CI 命令。

不要通过网络实测作为唯一测试。

## 7. 输出格式

每次完成任务汇报：

```text
Changed
Tests run
Known limitations
Files touched
```

不要声称“准确”除非测试或 source 支持。

## 8. Scope Control

如果任务是 `T0302 Basic attack scheduler`，不要顺便实现登录、Meta 页面或 Rust migration。

## 9. Schema First

跨模块新功能优先扩 schema/type，再实现 runtime，再 UI；避免 UI 私有字段变成事实标准。

## 10. 版本

任何 fixture 必须显式写 patch revision。禁止名为 `current.json` 的不可复现 Golden fixture。
