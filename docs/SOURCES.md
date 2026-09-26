# SOURCES — 官方与主要数据来源

> 基准日期：2026-09-27。链接和政策可能变化，Patch 更新时应重新核对。

## 1. Riot TFT Patch Notes

当前参考：TFT Patch 18.3，2026-09-22；页面同时记录 2026-09-24 Mid-Patch/B Patch。

- https://teamfighttactics.leagueoflegends.com/en-au/news/game-updates/teamfight-tactics-patch-18-3/
- https://teamfighttactics.leagueoflegends.com/en-us/news/game-updates/

用途：

- Patch/B Patch 变化
- system changes
- champion/item/trait balance changes
- bug fixes

## 2. Riot TFT Developer Documentation

- https://developer.riotgames.com/docs/tft

当前确认：

- TFT API routing/platform 信息
- Data Dragon TFT 静态数据说明
- 官方明确说明 Data Dragon 在 Patch 后由人工流程更新，因此可能不立即同步

## 3. Riot Roles Revamped and Item Changes

- https://teamfighttactics.leagueoflegends.com/en-us/news/game-updates/roles-revamped-and-item-changes/

用途：

- Role system
- Mana generation changes
- Mana Regen 含义
- Lifeline 等术语变更

项目不能再用旧版“所有单位每次普攻 +10 Mana，所有单位受伤回蓝”作为统一模型。

## 4. Riot Set 18 / Enchanted Wilds

- https://teamfighttactics.leagueoflegends.com/en-us/
- https://teamfighttactics.leagueoflegends.com/en-us/news/game-updates/

当前 Set：18 — Enchanted Wilds。

## 5. CommunityDragon

- https://communitydragon.org/
- https://raw.communitydragon.org/

用途：

- Champion / Item / Trait / Ability 的客户端结构化数据
- internal IDs
- effect variables
- assets

原则：保存 raw snapshot 与 parser version，不直接让 Web 页面依赖外部实时文件。

## 6. Riot Data Dragon

Developer docs 中提供版本和 TFT assets。作为辅助/校验来源，不作为 Patch 上线瞬间唯一真源。

## 7. Riot TFT API

通过 Developer Portal 的 Reference/Docs 使用 TFT Match/League 等 endpoint。公开路由列表包含 NA/EU/KR/JP/SEA 等 Riot 平台，但不包含中国大陆腾讯服。

## 8. Manual Test Registry

隐藏机制必须建立项目自己的控制变量实验记录。每条记录至少包含：

- Patch revision
- setup
- observed value
- competing hypotheses
- evidence asset
- conclusion

这是长期 Mechanics 准确度的关键资产。
