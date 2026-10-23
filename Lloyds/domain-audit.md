# Lloyds Bank 域名审计

审查日期：2026-10-23（Europe/London）。范围：英国个人 Lloyds Bank Mobile Banking iOS App。此文件区分“官方归属”和“实测 App 业务依赖”，不把两者混为一谈。

## 方法与可信度

已实际读取以下 GitHub 文件的完整内容，再按固定提交重读并记录 blob SHA；没有仅凭搜索摘要入选域名。检索包含 Lloyds 专用规则、App/mobile/iOS 域名、认证和第三方技术服务；未找到可验证当前 App 全部业务的请求记录。社区规则、桌面脚本、CNAME 清单各自只能证明其记录的内容，不能证明当前 iOS 必需性。

- **高：官方归属/用途**：由银行官网、官网外链或官方明确文字支持。
- **中：关联线索**：公开规则或 CNAME 映射交叉验证，仍需 App 实机记录。
- **低：未核实**：仅名字、单一规则或模式名单；不进入正式订阅。

DNS 存在、证书或 CNAME、搜索结果、含 Lloyds 字样的仓库文件路径均不能单独证明银行归属。未访问可疑候选站点，不执行来源脚本，不使用其中的登录自动化方法。

## 已读取的 GitHub 资料

下表链接固定到提交，blob SHA 和相关行号见 [sources.json](sources.json)。来源用于证据比对；其原有代理/直连/拦截策略均不继承。

| ID | 实际文件及固定版本 | 采用方式 |
| --- | --- | --- |
| S1 | [jasonniceo/loon / Lloyds.list](https://github.com/jasonniceo/loon/blob/950aab8738f370b1d8bfd1991711413cb79668da/Lloyds.list)（`950aab8738f370b1d8bfd1991711413cb79668da`） | 提取银行后缀、四个具体主机和候选；剔除重复子域、关键词、UA、进程规则。 |
| S2 | [iniwex5/tools / rules/UK.list](https://github.com/iniwex5/tools/blob/0fe27b9fc518f2c70d6345ccc5a20c6c3f04d131/rules/UK.list)（`0fe27b9fc518f2c70d6345ccc5a20c6c3f04d131`） | 只提取 Lloyds 小节及通用风险域作审计；剔除其他银行、共享后缀与 co.uk 兜底。 |
| S3 | [hedrg/rules-mirror / custom/uk.list](https://github.com/hedrg/rules-mirror/blob/45585f484a0c6c2fba1faa4074fe0ebf269c1c05/custom/uk.list)（`45585f484a0c6c2fba1faa4074fe0ebf269c1c05`） | 交叉验证两个 Lloyds 主域；集团域名暂缓，其他地区及银行规则不采用。 |
| S4 | [KujouYuko/ClashRules / Clash/Rules/UKBank.list](https://github.com/KujouYuko/ClashRules/blob/e399fe98be85ba102042d8b854f7cef01627052b/Clash/Rules/UKBank.list)（`e399fe98be85ba102042d8b854f7cef01627052b`） | Lloyds 小节仅有两个主域，作为交叉证据；不导入整份英国银行清单。 |
| S5 | [AdguardTeam/cname-trackers / data/trackers/lexisnexis-risk-solutions.md](https://github.com/AdguardTeam/cname-trackers/blob/d519e17ee10e2d1c5b2762a78a8e11ec2b38ce5a/data/trackers/lexisnexis-risk-solutions.md)（`d519e17ee10e2d1c5b2762a78a8e11ec2b38ce5a`） | 读取完整 CNAME 映射；确认六个含 Lloyds 的第三方主机及对应别名，用于审计而非拦截。 |
| S6 | [liandu2024/clash / list/wv/uk.list](https://github.com/liandu2024/clash/blob/681d30136e2d9b79fc93d310638cb7eca1e236e9/list/wv/uk.list)（`681d30136e2d9b79fc93d310638cb7eca1e236e9`） | 额外地区规则交叉验证 lloydsbank.com；无新的专属业务域。 |
| S7 | [xOS/Config / RuleSet/UKOnly.list](https://github.com/xOS/Config/blob/58faa924d420f9ee67ae53df122569d07891f6d8/RuleSet/UKOnly.list)（`58faa924d420f9ee67ae53df122569d07891f6d8`） | 只发现 Lloyds 关键词规则；不采用。共享监控规则不能当作 Lloyds 专用证据。 |
| S8 | [m0zgen/dns-hole / regex/common-wl.txt](https://github.com/m0zgen/dns-hole/blob/de76599989d2b1f803fa1d3b699fbe956e1a9602/regex/common-wl.txt)（`de76599989d2b1f803fa1d3b699fbe956e1a9602`） | 额外 DNS 白名单交叉验证两个银行主域；不继承 Dynatrace 共享后缀。 |
| S9 | [gdelmas/LloydsBank-MoneyMoney / Lloyds Bank UK.lua](https://github.com/gdelmas/LloydsBank-MoneyMoney/blob/ac8dc1743455439233bdfad0c0241dbda03e7f78/Lloyds%20Bank%20UK.lua)（`ac8dc1743455439233bdfad0c0241dbda03e7f78`） | 桌面 MoneyMoney 脚本记录官方个人网银主机；不是 iOS 抓包证据，不执行脚本。 |
| S10 | [chartingshow/crypto-firewall / src/blacklists/bank-phishing-filters/lloydsbank-com/adblock-list.txt](https://github.com/chartingshow/crypto-firewall/blob/fce2dd55bb73722d4111f97a42c73bc150163ded/src/blacklists/bank-phishing-filters/lloydsbank-com/adblock-list.txt)（`fce2dd55bb73722d4111f97a42c73bc150163ded`） | 实际读取品牌防钓鱼模式表，包含 lloydsbank.info；这是风险提示，非当下恶意事件或归属证明。 |

AdGuard 的 [仓库说明](https://github.com/AdguardTeam/cname-trackers/blob/master/README.md)及 `data/trackers/lexisnexis-risk-solutions.txt` 也已读取；本项目只利用关联事实，不导入它们的拦截语法。

## A 类：官方归属已确认

| 域名/主机 | 证据 | 业务证据与决定 |
| --- | --- | --- |
| `lloydsbank.co.uk` | O2 官网链接；S1/S2/S3/S4/S8/S9 | 个人网银登录主机位于其下。正式后缀规则，归属高；App 全量依赖未实测。 |
| `lloydsbank.com` | O1 官网和 App 指南；S1/S3/S4/S6/S8 | 正式后缀规则，归属高；同时覆盖官网内容及此命名空间下商业/统计子域，不宣称都是个人 App 必需。 |
| `lloydsbank-online.co.uk` | O3 官方 Open Banking 段；S1 | 从 B 类升为 A 类：已确认授权业务用途，纳入正式后缀；不是仅凭名字入选。 |
| `lloydsbankinggroup.com` | O4 集团官网；S1/S3 | 官方集团域，但集团有多个品牌，个人 App 必需性和独占性不足。保留候选，不纳入整个后缀。 |
| `lloydsbanking.com` | O5 官方邮件地址 | 官方组织使用证据成立；邮箱域不等于个人 App API。候选，未纳入正式规则。 |

[S1] 的 `api.lloydsbank.co.uk`、`mobile.lloydsbank.co.uk` 只是社区列举的主机，没有据此断言它们是当前 iOS API；`online.lloydsbank.co.uk` 另有 O2 官方入口证明，`www.lloydsbank.com` 有 O1。四者均已被正式后缀覆盖，不重复添加 DOMAIN。

## B 类：尚未核实

| 域名 | 查证结果 | 决定 |
| --- | --- | --- |
| `lloydsbank.info` | S1 纳入，但没有找到能核实官方归属和 App 用途的银行官方资料；S10 第 287 行列于品牌防钓鱼模式表。名单本身不证明当前恶意。 | 低置信度候选、带风险标记；不订阅、不主动访问，也不把它自动加入阻断规则。 |

官方可验证证据应优先于名称相似。以后出现其他 Lloyds 命名域，仍需独立核查。

## C 类：第三方共享服务

| 域名 | 实际证据与限制 | 决定 |
| --- | --- | --- |
| `dynatrace.com` | S2、S8 给出共享后缀。O6 供应商确认集团 IT 合作，但没有公开个人 iOS 专用采集主机。 | 排除整个后缀；需请求日志定位实际主机及共享程度。 |
| `amazontrust.com` | S2；O7 说明 OCSP/CRL 共享证书吊销检查。 | 排除整个后缀；不拦截、替换或伪造证书验证。 |
| `online-metrix.net` | S2 通用英国银行规则；S5 显示多客户映射，O8 是跨客户反欺诈服务。 | 排除整个后缀；精确候选如下。 |
| `threatmetrix.com` | O8 官方反欺诈产品；本次没有查得 Lloyds 个人 iOS 专用该后缀主机。 | 排除整个后缀，不猜测主机名。 |
| `demdex.net`、`cm.everesttech.net`、`omtrdc.net` | S2 混合“小马系列”小节列出；没有据此确认 Lloyds 个人 App 的专用主机及必要性。 | 全部排除；不为增加数量而扩大分流。 |

### 实际发现的具体风险服务主机

以下为 S5 固定版本第 2137–2142 行的 CNAME 关联记录，归属关联为中置信度。它们不等同于本次 iOS 运行中实际发出的请求。

| 银行侧别名 | 第三方目标 | 决定 |
| --- | --- | --- |
| `check2.lloydsbank.co.uk` | `h-lloydsbank.online-metrix.net` | 银行别名已被正式后缀覆盖；第三方精确主机列为候选，等候 App 直接请求或其他必要性证据。 |
| `cib.currency.lloydsbank.com` | `h-lloyds-cib.online-metrix.net` | 企业/币种业务上下文，不额外纳入第三方主机。 |
| `cbcdn.lloydsbank.com` | `h-lloyds-soc.online-metrix.net` | 未确认个人 App 依赖，不额外纳入。 |
| `ww9.lloydsbank.com` | `h-lloydscorporate.online-metrix.net` | corporate 上下文，排除。 |
| `lab4.lloydsbank.com` | `h-lloydslink.online-metrix.net` | LloydsLink 上下文，未确认个人 App 依赖，排除。 |
| `ela1.bankofscotland.co.uk` | `h-lloydsboscorporate.online-metrix.net` | 明确对应另一银行，排除两者。 |

CNAME 目标不一定需要额外路由：客户端仍可能按原请求域名匹配。必须查看 Loon 的实际目标、命中和出口；不能从 CNAME 表推断 SDK 直接访问目标主机。这里没有把供应商清单转为 REJECT 规则。

2026-10-23 使用环境 DNS 解析器执行 `Resolve-DnsName -Type CNAME -DnsOnly`：`check2.lloydsbank.co.uk` 对应 `h-lloydsbank.online-metrix.net`，与公开表一致；`online.lloydsbank.co.uk` 对应 `s16370.cdn.lloydsbanking.com`，`www.lloydsbank.com` 对应 `s5933.cdn.lloydsbanking.com`。这些是时间点 DNS 关联，可能轮换，不等于 App 直接请求 CDN 主机。两个 CDN 目标不额外加规则；未来若有直接请求记录再审查。此观察增强集团域的实际关联证据，但不能证明整个集团后缀为个人 App 独占。

## 去重、边界与冲突结论

- 正式文件仅 3 个互不包含的后缀，没有冗余 DOMAIN，没有附带策略。
- 没有 Halifax、TSB、Bank of Scotland、Monzo、Kraken、WorldFirst 的自有域名；不继承英国综合列表中的 `uk`、`co.uk` 或其他公共后缀。
- 不使用关键字、IP、进程或 USER-AGENT 规则，不配置 MITM、证书解密、改写或绕过认证。
- DOMAIN-SUFFIX 按 DNS 标签边界匹配，不能误命中 `evil-lloydsbank.com` 或 `lloydsbank.com.example.net`；脚本包含这类负例。
- 无法单凭域名区分发起 App。其他 App 若进入 Lloyds 授权页，也会命中本规则；不能承诺绝对的 App 隔离。
- 本次只检查新增文件，未审查完整活动 Loon 配置。现有本地规则、DNS 拦截、通用广告规则可能提前命中。认证/反欺诈/证书请求的端到端可达性需实机验证。
- `candidates.list` 全部为注释，正式校验器拒绝任何候选可执行行；没有候选合并程序。

## 官方及产品一手来源

- **O1**：[Lloyds 官方个人 Mobile Banking App 介绍；证明官网归属与业务背景，未提供完整 API 清单。](https://www.lloydsbank.com/help-guidance/everyday-banking/mobile-banking-app.html)
- **O2**：[官方个人登录链接指向 online.lloydsbank.co.uk。](https://www.lloydsbank.com/help-guidance/everyday-banking/getting-online/log-in.html)
- **O3**：[Open Banking 段明确说明授权跳转使用 lloydsbank-online.co.uk。](https://www.lloydsbank.com/help-guidance/protecting-yourself-from-fraud/authorised-push-payment-scams.html)
- **O4**：[集团官方站；集团覆盖多个品牌，不能由集团归属推导 Lloyds App 独占。](https://www.lloydsbankinggroup.com/)
- **O5**：[官方反诈骗收件地址位于 lloydsbanking.com；邮件证据不等同于 App 网络依赖。](https://www.lloydsbank.com/help-guidance/protecting-yourself-from-fraud/scam-messages.html)
- **O6**：[供应商确认集团 IT 合作；未公开个人 iOS App 专用接收主机名。](https://www.dynatrace.com/news/press-release/dynatrace-teams-with-lloyds-banking-group-to-reduce-it-carbon-emissions/)
- **O7**：[amazontrust.com 用于共享证书吊销检查 OCSP/CRL；非 Lloyds 独占服务。](https://docs.aws.amazon.com/acm/latest/userguide/acm-certificate-characteristics.html)
- **O8**：[跨客户共享的数字身份与反欺诈产品；不能整体纳入单一银行规则。](https://risk.lexisnexis.com/products/threatmetrix)
- **L1**：[Loon DOMAIN / DOMAIN-SUFFIX 语法及后缀边界。](https://nsloon.app/docs/Rule/domain_rule/)
- **L2**：[远程规则文件每行使用 Loon 支持的规则语法。](https://nsloon.app/docs/Rule/sub_rule/)
- **L3**：[官方示例 [Remote Rule] 使用 URL,policy=PROXY,enabled=true。](https://github.com/Loon0x00/LoonExampleConfig/blob/master/example.conf)

## 后续验证及隐私

按 [README](README.md) 分阶段收集经人工脱敏的主机名；先判断遗漏，再确认官方归属/第三方共享性和业务必要性。安全请求不得靠屏蔽、伪造或修改来验证。原始日志和敏感信息不得上传到 GitHub 或研究服务。静态检查、Raw 检查和未完成项分别记录在 [VALIDATION.md](VALIDATION.md)。
