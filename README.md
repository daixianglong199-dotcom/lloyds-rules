# Lloyds Bank：Loon 英国分流

在现有 [daixianglong199-dotcom/lloyds-rules](https://github.com/daixianglong199-dotcom/lloyds-rules) 仓库维护唯一正式订阅：共 7 条（核心来源 3 条 + 扩展来源 4 条），合计 4 个独立后缀匹配和 3 个精确主机匹配。

- [唯一正式规则：Lloyds-UK.list](Lloyds/Lloyds-UK.list)（原扩展文件已弃用，无需订阅）
- [Loon 导入说明：现有 Kraken英国固定 策略](Lloyds/README.md)
- [可复制订阅配置](Lloyds/Loon-RemoteRule.example.conf)
- [域名审计与完整覆盖清单](Lloyds/domain-audit.md)
- [来源证据](Lloyds/sources.json) / [覆盖统计](Lloyds/coverage-summary.json)
- [静态测试与发布记录](Lloyds/VALIDATION.md)

统一正式文件覆盖 36 个审计条目；审计共 65 个去重条目，核心匹配 26 个，扩展另匹配 10 个；这些数字不能等同于已证实的 iOS 请求依赖。扩展依据银行网页、DNS 和部分 Android/平台未明 App 报告，**尚无 iOS 实机验证**。

不包含节点、完整本地配置、请求日志或凭据。命名空间与 App 边界不同，集团辅助服务可能跨品牌共用。使用前阅读范围说明。

```powershell
node validate.mjs
```
