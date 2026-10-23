# Lloyds Bank：Loon 英国出口分流

独立维护英国 Lloyds Bank 个人 Mobile Banking App 的域名规则。目前正式规则 **3 条**，只匹配经过核实的银行域名，不在规则内指定出口策略。

- [正式规则](Lloyds/Lloyds-UK.list)
- [Loon 导入与维护说明](Lloyds/README.md)
- [域名审计、候选及排除理由](Lloyds/domain-audit.md)
- [来源清单与固定版本](Lloyds/sources.json)
- [检查及发布状态](Lloyds/VALIDATION.md)

目标仓库：`daixianglong199-dotcom/lloyds-rules`。是否已发布、Raw 是否可用，以检查报告为准。

在仓库根目录运行：

```powershell
node validate.mjs
```

不包含节点、完整 Loon 配置或请求日志。未取得实际 App 请求记录，不能声称完整覆盖登录、账户、银行卡及交易记录业务。
