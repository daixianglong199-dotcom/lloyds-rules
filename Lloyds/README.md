# Lloyds Bank UK：iOS Loon 远程规则

将匹配的 Lloyds 域名交给你在 Loon 中指定的英国节点或策略组。正式文件共 **3 条 DOMAIN-SUFFIX**，不含策略名称。

## 范围与证据

| 域名 | 用途证据 | 范围 |
| --- | --- | --- |
| `lloydsbank.co.uk` | 官方登录入口 `online.lloydsbank.co.uk`；多份公开规则交叉验证 | 主域及全部层级子域 |
| `lloydsbank.com` | 官方个人银行网站、App 说明、业务帮助入口 | 主域及全部层级子域 |
| `lloydsbank-online.co.uk` | 官方反诈骗页面明确用于 Open Banking 授权跳转 | 主域及全部层级子域 |

证据、版本及置信度见 [domain-audit.md](domain-audit.md) 和 [sources.json](sources.json)。域名官方归属不等于某一 App 版本的业务必要性；没有实机日志，不能保证登录、账户查询、银行卡管理、交易记录全部覆盖。

规则按目标域名匹配，不能识别发起请求的 App。因此浏览器或 Monzo 等 App 若主动发起 Lloyds Open Banking 授权，同一 Lloyds 目标域名也会匹配。`lloydsbank.com` 下的商业银行、内容或统计子域也在后缀范围内。这里不承诺按 App 完全隔离；其他 App 自有域名及共享第三方根域未纳入。

## 发布地址

已发布到独立公开仓库：[daixianglong199-dotcom/lloyds-rules](https://github.com/daixianglong199-dotcom/lloyds-rules)。[正式 Raw 订阅](https://raw.githubusercontent.com/daixianglong199-dotcom/lloyds-rules/main/Lloyds/Lloyds-UK.list) 已通过匿名 HTTP 200 和本地内容一致性检查，记录见 [VALIDATION.md](VALIDATION.md)。

```text
https://raw.githubusercontent.com/daixianglong199-dotcom/lloyds-rules/main/Lloyds/Lloyds-UK.list
```

不要订阅 `candidates.list`；它全部为注释，候选不会自动合并到正式文件。

## Loon 导入

1. 在 Loon 中确认一个现有英国节点或策略组的准确名称，并选好实际英国出口。本文不创建策略组，也不修改你的本地配置。
2. 在规则订阅界面添加上方 Raw URL，指定该策略；或手动把下面一行合并到现有 `[Remote Rule]` 段。
3. 将 `你的英国策略实际名称` 替换成 Loon 中已有名称，保留其大小写、空格及符号。
4. 更新订阅，在规则模式下确认加载 3 条有效规则。先查看已有本地规则是否提前匹配；在远程集合中使本规则优先于存在重叠的地区、广告拦截或金融集合。Loon 按实际优先级决定命中，仅移动远程行不保证覆盖本地规则。
5. 依次测试登录、账户概览、交易记录、银行卡管理，并查看实际命中规则、策略和出口。不要为了测试进行真实付款。

```ini
[Remote Rule]
https://raw.githubusercontent.com/daixianglong199-dotcom/lloyds-rules/main/Lloyds/Lloyds-UK.list, policy=你的英国策略实际名称, tag=Lloyds-UK, enabled=true
```

格式依据 [Loon 规则订阅文档](https://nsloon.app/docs/Rule/sub_rule/) 和 [官方示例配置](https://github.com/Loon0x00/LoonExampleConfig/blob/master/example.conf)。文件是原生逐行规则，不是 Clash YAML 或完整 Loon 配置。

## 安全服务与冲突

本规则只选择连接出口，不阻断、不改写、不解密请求，不改变目标域名、证书或身份验证。没有 MITM、请求重写、风控/设备检测绕过，也没有 IP、进程、UA 或关键词规则。

`amazontrust.com`、`online-metrix.net` 等未加入本规则，继续由现有配置处理；“未加入”不表示拒绝。现有广告拦截、DNS 拦截、本地 `REJECT` 或更早规则仍可能阻断认证和证书检查。本项目没有检查你的完整活动配置，不能保证它们已放行。遇到问题，先看命中记录；确认具体主机和用途后再做最小范围例外，不要放行整个共享后缀，更不要屏蔽银行安全检测来尝试登录。

## 日志增量核查

不需要 HTTPS 解密。保持银行正常安全流程，只在设备本地查看 Loon 的连接域名、命中策略、连接结果和功能发生顺序。分别记录登录、账户、交易记录、银行卡管理；以空闲阶段和其他 App 的连接作对照，避免把后台流量算作 Lloyds。

分享前在本地人工脱敏，仅保留经审查的主机名和非敏感功能标签/成功失败结果。不要提供或提交原始日志、URL 路径与查询、Cookie、Token、Authorization、请求体、卡号、账号、姓名、设备标识及其他个人信息。域名标签本身若含用户/设备标识，也须删去。

可把审核后的纯主机名单保存在仓库内被忽略的 `hosts.local.txt`，每行一个主机，不接受 URL、CSV、请求头或完整日志：

```powershell
node validate.mjs --hosts hosts.local.txt
```

工具完全离线，只输出已覆盖、待审查、未分类主机；不自动追加任何规则。未分类不等于必需。新增正式主机前须核实归属、业务阶段、可重复性、是否被现有后缀覆盖，以及是否被其他 App 共用；第三方优先采用 `DOMAIN` 精确主机。然后人工更新正式文件、审计记录、来源清单和检查报告，再单独提交。

## 回滚与发布

临时回滚可将这条订阅设为 `enabled=false`。版本回滚应使用 `git revert <本任务提交SHA>` 并正常推送，避免强推改写历史；也可把 Raw URL 的 `main` 换为已经验证的历史提交 SHA 固定订阅版本。

只有在以 `daixianglong199-dotcom` 登录并确认有该仓库创建/推送权限后，才发布到目标仓库。仓库应为公开仓库，才能提供无需 Token 的 Loon 订阅。账号操作步骤见 [VALIDATION.md](VALIDATION.md)。
