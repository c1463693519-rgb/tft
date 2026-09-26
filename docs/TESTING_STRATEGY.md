# TESTING_STRATEGY — 数值正确性与软件测试

## 1. 测试金字塔

```text
Rule Unit Tests
Effect Runtime Tests
Engine Scenario Tests
Golden Champion Tests
Patch Regression
API Contract Tests
UI E2E
Performance Benchmarks
```

## 2. Rule Unit Tests

每条公式独立测。例如正 Armor：

```text
1000 raw physical, armor 0 → 1000
1000 raw physical, armor 100 → expected result
```

不要只通过网页人工点击验证数学核心。

## 3. Effect Runtime Tests

测试：

- Trigger 是否在正确事件触发
- stack max
- duration expiry
- once-per-combat
- MAX/ADD/REPLACE
- conditional effect

## 4. Timeline Tests

给一个极简单位，无技能无移动：验证 attack timestamps。

Caster：验证 attack mana + mana regen 到 full mana 的时间轴。

## 5. Golden Champions

每个 Patch 至少选择：

- AD Marksman
- AP Caster
- Tank
- Hybrid/stacking unit

每个至少 3 个固定 Build 和多个 enemy profile。

## 6. Golden Results

Golden 输出存 snapshot，但 snapshot 变化不允许“一键全部 accept”。必须解释变化原因：

- Patch data change
- rule correction
- engine bug fix

## 7. Accuracy Tolerance

建议初值：

```text
Pure formula: exact / floating epsilon
Damage scenario: ±0.1%
Timing: ±10~20ms（取决于可验证精度）
```

实测后调整。

## 8. Controlled In-game Verification

每个隐藏机制测试记录：

```text
Patch
Test setup
Champion
Items
Traits
Target
Observed result
Expected alternatives
Conclusion
Video/screenshot/source ref
```

尽量一次只改变一个变量。

## 9. Regression Gate

Patch promote 条件：

- schema checks pass
- critical rule tests pass
- golden champion critical cases pass
- unsupported/unknown delta reviewed

非关键近似测试可以 warning，但必须出现在 release note。

## 10. API Contract

Zod/OpenAPI schema 同时验证 request/response；错误码固定。

## 11. UI E2E

最低场景：

1. 进入 Champion Lab。
2. 选择棋子/星级。
3. 填装备。
4. 修改 Armor。
5. Result 更新。
6. 添加对比 Build。
7. 分享 URL 并复现状态。

## 12. Property-based Tests

适合数学不变量：

- 在其他条件不变时，正 Armor 增加不应提高受到的物理伤害。
- 0 Damage 不应改变 HP。
- Shield 不应让 HP 先于 Shield 扣除。
- 相同 seed + context → 相同结果。

注意“更高 AD 一定更高总 DPS”等不总成立，不能建立错误不变量。

## 13. Performance Benchmark

记录：

- single simulation
- 1000 simulations
- full 3-item optimizer
- parameter sweep

只在 profiler 证明需要时做 Rust/WASM 优化。
