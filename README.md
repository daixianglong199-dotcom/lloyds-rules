# Lloyds Bank：Loon 英国分流

在现有 [daixianglong199-dotcom/lloyds-rules](https://github.com/daixianglong199-dotcom/lloyds-rules) 仓库维护核心和可选扩展：核心 3 条 + 扩展 4 条，合计 4 个独立后缀匹配和 3 个精确主机匹配。

- [核心规则](Lloyds/Lloyds-UK.list) / [可选扩展](Lloyds/Lloyds-UK-Extended.list)
- [Loon 导入说明：现有 Kraken英国固定 策略](Lloyds/README.md)
- [可复制订阅配置](Lloyds/Loon-RemoteRule.example.conf)
- [域名审计与完整覆盖清单](Lloyds/domain-audit.md)
- [来源证据](Lloyds/sources.json) / [覆盖统计](Lloyds/coverage-summary.json)
- [静态测试与发布记录](Lloyds/VALIDATION.md)

审计 65 个去重条目，核心匹配 26 个，扩展另匹配 10 个；这些数字不能等同于已证实的 iOS 请求依赖。扩展依据银行网页、DNS 和部分 Android/平台未明 App 报告，**尚无 iOS 实机验证**。

不包含节点、完整本地配置、请求日志或凭据。命名空间与 App 边界不同，集团辅助服务可能跨品牌共用。使用前阅读范围说明。

```powershell
node validate.mjs
```
