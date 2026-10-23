# Lloyds Bank UK：iOS Loon 统一正式规则

本项目在已有独立仓库内维护。把已匹配域名交给本地现有英国策略；不提供节点，不更改银行认证、设备安全检测、证书或请求内容。

## 唯一正式订阅文件

[Lloyds-UK.list](Lloyds-UK.list) 包含全部 **7 条**有效规则：3 条核心来源规则与 4 条扩展来源规则。以后只维护这个正式入口，Raw 地址保持不变。合并没有增加新域名，也没有提升任何条目的证据可信度。

[Lloyds-UK-Extended.list](Lloyds-UK-Extended.list) 已弃用，只保留 4 条扩展来源规则作为冻结兼容子集。请删除旧扩展订阅，只订阅正式文件一次；校验器会检查兼容内容始终等于正式文件中的对应子集。

核心来源的三个银行命名空间涵盖已确认的授权/OIDC/API 主机，无需逐主机重复添加。扩展来源依据银行网页、DNS 或历史 App 故障报告，**均未经过本项目 iOS 实机业务验证**。同一文件内的注释继续区分证据来源。

## 新增匹配范围

| 扩展规则 | 用途/证据 | 可信度与边界 | iOS 实测 |
| --- | --- | --- | --- |
| DOMAIN-SUFFIX,cdn.lloydsbanking.com | 当前登录、授权和 API DNS 指向此银行 CDN 子树，共记录 6 个目标主机 | 银行 CDN 关联高；可能跨集团品牌，不是整个 lloydsbanking.com 后缀；CNAME 本身不证明 App 直接请求这些目标 | 无 |
| DOMAIN,optimisation.data.lloydsbankinggroup.com | 公开爬虫记录个人网银的内容交付请求；DNS 指向 Adobe 租户 | 网页用途关联中；不扩大为整个集团后缀 | 无 |
| DOMAIN,lloydsbankinggroup.tt.omtrdc.net | DNS 租户关联、AdGuard 精确例外和 App 设备认证故障报告 | 中；已知 Android/未注明平台的报告，不能外推为 iOS 已验证 | 无 |
| DOMAIN,bf10006sbr.bf.dynatrace.com | 当前银行官方登录 HTML 的 script 引用，另有爬虫数据交叉线索 | 当前网页关联中；只纳入具体租户，未纳入供应商共享后缀或 js-cdn 主机 | 无 |

`lloydsbanking.com` 的证据已超过邮件用途，但只提升其 CDN 子树。`lloydsbankinggroup.com` 发现真实网页交付主机，但只提升该具体主机。集团根后缀仍不订阅。

## Loon 导入：使用现有 Kraken英国固定

已只读检查原有 `Loon-Main.lcf` 和 `Loon-Main.GitHub.lcf`：两者都存在 `Kraken英国固定 = select,英国节点`；`英国节点` 是英国节点名称筛选。这里只验证配置定义，未确认手机当前选中节点的实际地理出口。

1. 在 Loon 的现有 `Kraken英国固定` 策略里选好实际英国节点。该组与 Kraken 共用，切换组内节点会同时影响使用该组的服务。
2. 将下面唯一一行合并到已有 `[Remote Rule]` 段，删除旧 `Lloyds-UK-Extended.list` 订阅。不要重复创建同名段或覆盖主配置。
3. 更新订阅，`Lloyds-UK` 应加载 7 条。检查已有本地规则/拦截是否提前命中；正式文件没有重复或后缀冗余。
4. 在规则模式下依次检查登录、账户概览、交易记录、银行卡管理的命中域名、策略和出口；不为测试发起真实付款。

```ini
[Remote Rule]
https://raw.githubusercontent.com/daixianglong199-dotcom/lloyds-rules/main/Lloyds/Lloyds-UK.list, policy=Kraken英国固定, tag=Lloyds-UK, enabled=true
```

[可复制配置片段](Loon-RemoteRule.example.conf)。配置格式参考 [Loon 订阅文档](https://nsloon.app/docs/Rule/sub_rule/) 与 [官方示例](https://github.com/Loon0x00/LoonExampleConfig/blob/master/example.conf)。这里的 `Kraken英国固定` 已通过本地配置核实，不是占位符。

## 覆盖数字应如何理解

审计表共 **65 个去重域名/主机/规则基域条目**，涉及 **17 个可注册域名**；这是研究清单，不是 65 个已确认 iOS 依赖。

- 核心匹配 26 个审计条目，包含已确认授权/OIDC/API 和本就位于银行后缀下的网页/资源主机。
- 扩展新增匹配 10 个条目：6 个 CDN 目标、CDN 子后缀基域本身，以及 3 个具体服务主机。
- 8 个未覆盖候选；另有 21 个共享服务根域、其他品牌/沙箱主机或被主动限定的集团根域，故意不匹配。
- 唯一正式文件内的有效匹配表达式共 7 条：**4 条独立 DOMAIN-SUFFIX + 3 条 DOMAIN**，不是 7 个完整供应商/集团后缀。

[逐条审计](domain-audit.md)、[机器可检查统计](coverage-summary.json)、[固定来源与分层决定](sources.json) 保持一致。重复列出已有后缀覆盖的 api/mobile/authorise/secure-api 不会提高覆盖率。

## 安全、范围与未覆盖项

不使用关键词、IP、进程、UA、MITM、证书解密、脚本或请求改写。没有任何 REJECT 规则。扩展中的监控/交付域只改变连接出口，不绕过设备验证，也不保证消除认证故障。

未加入规则的请求继续服从现有配置，**不代表被本项目拦截**。DNS 上游拦截、本地 REJECT 或更优先规则仍可能阻断安全请求；新增路由不能修复上游的零地址解析。需看命中与解析结果，再对实际误拦截的具体主机做最小范围处理，不放行整个共享服务后缀。

域名路由无法区分请求来自哪个 App。核心也覆盖银行商业/内容子域；扩展 CDN 和集团租户可能被 Halifax、Bank of Scotland 等品牌共用。没有添加这些品牌的自有域名，但不能承诺按 App 完全隔离。

`h-lloydsbank.online-metrix.net` 仍是候选：CNAME 记录只证明与 `check2.lloydsbank.co.uk` 有关联，后者已在核心覆盖，尚缺 iOS 直接请求或必要性证据。`lloydsbank.info` 没有核实官方归属，继续隔离。候选清单全为注释，任何候选都不会自动进入正式或兼容规则文件。

## 验证及日志增量

在仓库根目录运行 `node validate.mjs`。它检查正式文件语法、去重/覆盖、兼容子集、审计一致性、候选隔离、统计及唯一订阅策略。实际测试结果和发布状态见 [VALIDATION.md](VALIDATION.md)。

本项目没有登录用户银行账户，也没有真实 iOS 业务抓包。公开 Apple 元数据及银行 AASA 能确认 App 与网站关联，不能代替原生网络测试。

后续在手机本地按登录、账户、交易记录和银行卡管理分阶段观察 Loon 连接，不启用 HTTPS 解密。以空闲及其他 App 阶段作对照，避免后台流量混入。分享前人工脱敏，只保留纯主机名、非敏感阶段及连接成功/失败。不要上传 Cookie、Token、URL 路径/查询、请求头/体、卡号、账号、身份资料或设备标识；主机标签若含标识也须删除。

可把已审查的每行一个纯主机名存为被忽略的 `hosts.local.txt`，运行：

```powershell
node validate.mjs --hosts hosts.local.txt
```

工具完全离线，分别输出正式文件内核心来源覆盖、扩展来源覆盖、候选、已知但未路由、未分类。前两类都已经由唯一正式订阅匹配。它不改写任何规则；未知主机仍需核实用途与共享性，再人工调整。

## 回滚与维护

需回滚时，可把唯一正式订阅固定到历史提交；合并前版本 3e3cbc770a73f6e1d59d427895d484b7be3537c2 的同一路径仅包含原 3 条核心规则。当前统一正式文件不再提供独立扩展开关。每个已发布提交均可将 Raw URL 中的 `main` 换为提交 SHA 固定版本。仓库维护采用正常提交/`git revert`，不强推改写历史；不创建新仓库或改动 Kraken、WorldFirst 项目。
