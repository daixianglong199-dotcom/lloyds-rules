# Lloyds Bank 核心与扩展域名审计

日期：2026-10-23（Europe/London）。本轮更新现有仓库；未创建新仓库。上一版结论缺少对真实 API、CDN、网页辅助服务和 App 故障记录的区分，本轮按用途与证据层级重新审查。

## 研究标准和计数

共 65 个唯一审核字符串，涉及 17 个可注册域名；包括规则基域、实际发现的具体主机、候选和明确排除的共享服务根域。**不是已证实 iOS 依赖数量。**没有把爬虫里所有其他网站和 Dynatrace 租户池混入 Lloyds 清单。

| 互斥分组 | 数量 |
| --- | --- |
| 核心已覆盖 | 26 |
| 扩展新增覆盖 | 10 |
| 尚未覆盖候选 | 8 |
| 故意不匹配的排除/集团根域 | 21 |
| 合计 | 65 |

生效表达式为核心 3 条、扩展 4 条；合并后 4 条互不覆盖的 DOMAIN-SUFFIX 与 3 条 DOMAIN。当前 0 个条目经过本项目 iOS 运行测试。统计由校验器从真实规则和完整清单重算，见 [coverage-summary.json](coverage-summary.json)。

## 已确认业务入口与已有覆盖

官方 O9 将 `authorise.lloydsbank.co.uk`、`authorise-api.lloydsbank.co.uk`、`secure-api.lloydsbank.com`、`secure-api-eidas.lloydsbank.com` 用于授权、发现和证书认证 API；均已被核心后缀覆盖。官方 App-to-App 文档把授权旅程与银行 App 登录连接起来，但不证明所有公开 TPP API 都由个人 App 直接调用。这里不发送带身份或客户端证书的请求。

`api.lloydsbank.co.uk`、`mobile.lloydsbank.co.uk` 来自社区规则，当前用途可信度较低；即使有效也已被核心后缀覆盖。登录 HTML 的 bcdn/wup 主机同理，不为了数量再添加 DOMAIN。

Apple 查询返回个人 App bundle ID `com.lloydstsb.LloydsTSB`、版本 `195.03`；银行公开 AASA 包含相同标识。这是官方关联证据，不是二进制域名清单，也不是实机抓包。`authorise` 的 AASA 路径本次返回 404，未据此推断缺失或猜测其他 App 主机。

## 集团域名重新评估

| 对象 | 新证据 | 本轮决定 |
| --- | --- | --- |
| lloydsbanking.com | 登录、网站、授权、OIDC 和两个 API 域名的当前 CNAME 指向其 CDN 子树 | 不是仅邮件域。扩展加入 cdn.lloydsbanking.com 子后缀，覆盖 6 个记录中的目标；不加入整个集团根后缀。 |
| lloydsbankinggroup.com | R6 爬虫记录个人网银发往 optimisation.data 子域的请求；R4 也有该主机 | 扩展仅纳入 optimisation.data 精确主机。集团门户、招聘等不扩入。 |
| analytics.data.lloydsbankinggroup.com | R4 名单和当前 CNAME 证明网页统计关联 | 仍为候选；缺少个人原生业务必要性，未与 optimisation 混同。 |

CDN 别名的对应关系由 D2 记录：

| 银行请求主机 | CNAME 目标 |
| --- | --- |
| `online.lloydsbank.co.uk` | `s16370.cdn.lloydsbanking.com` |
| `www.lloydsbank.com` | `s5933.cdn.lloydsbanking.com` |
| `authorise.lloydsbank.co.uk` | `s10190.cdn.lloydsbanking.com` |
| `authorise-api.lloydsbank.co.uk` | `s13966.cdn.lloydsbanking.com` |
| `secure-api.lloydsbank.com` | `s3031.cdn.lloydsbanking.com` |
| `secure-api-eidas.lloydsbank.com` | `s37706.cdn.lloydsbanking.com` |

DNS 只证明时间点关联。按原始主机匹配时，别名目标未必需要单独规则；扩展对子树的覆盖是对直接请求该命名空间的补充，不能据此声称新增了 6 个已验证 App 请求。

## 具体第三方服务的决定

| 主机/对象 | 采用证据 | 决定与限制 |
| --- | --- | --- |
| lloydsbankinggroup.tt.omtrdc.net | R10 精确维护例外，R11 Android 设备认证故障和 R12 单主机恢复报告；D2 从银行 optimisation 别名指向它 | 加入可选扩展，精确匹配。报告年代为 2024，R11 后续还讨论服务器修复部署问题；不宣称因果在当前 iOS 已成立。 |
| bf10006sbr.bf.dynatrace.com | O10 当前银行登录 HTML 的 script 引用；R8 为网页行为交叉线索 | 加入可选扩展，只匹配这个租户主机。R8 的其他租户不能据统计池外推为 Lloyds 依赖。 |
| h-lloydsbank.online-metrix.net | S5/R3 的 CNAME 表和当前 DNS；R5 通用 smartphone 名单 | 仍为候选。通用手机名单不是 Lloyds iOS 测试，CNAME 不能证明 App 直接访问目标；check2 银行别名已被核心覆盖。 |
| lloydsbankinggroup.d3.sc.omtrdc.net、Qualtrics 候选 | R13 初始多主机报告 | 报告随后被作者撤回为 false alarm；不按初始描述加入扩展。 |
| 三个 dashboard.co.uk messaging 主机 | R7 记录多个集团品牌网页请求 | 作为聊天/消息候选保留，不能证明个人 iOS 依赖。 |
| js-cdn.dynatrace.com、Dynatrace/Amazon Trust/ThreatMetrix 等根后缀 | 共享供应商内容或证书/安全服务 | 不订阅整个后缀。精确 js-cdn 主机同样被广泛共用，不能因精确语法就视为 Lloyds 专属。 |
| lloydsbank.info | S1 命名规则，S10 防钓鱼模式表 | 没有核实银行官方归属；候选隔离，不访问，不自动拦截或放行。 |

所有候选都逐条复核；候选文件只有注释。沙箱开发 API、另一银行的 CNAME 以及企业侧第三方主机未因名字中包含 Lloyds 就晋升。不得把非银行主体 Lloyd's of London、Lloyd's List 等命中混入。

## 固定版本 GitHub 文件来源

已实际读取以下 20 个完整文件；相关行及 blob SHA 保存在 [sources.json](sources.json)。对新增文件使用检索返回的固定提交读取，不凭搜索摘要收录。社区脚本和名单只作证据，不执行或继承其拦截策略。

| ID | 文件（固定提交链接） | blob SHA |
| --- | --- | --- |
| S1 | [jasonniceo/loon / Lloyds.list](https://github.com/jasonniceo/loon/blob/950aab8738f370b1d8bfd1991711413cb79668da/Lloyds.list) | `af85782bd2e41e89117124137a380c8349bb69ee` |
| S2 | [iniwex5/tools / rules/UK.list](https://github.com/iniwex5/tools/blob/0fe27b9fc518f2c70d6345ccc5a20c6c3f04d131/rules/UK.list) | `9a955cda505699f6517eec41d1b501914bbd3610` |
| S3 | [hedrg/rules-mirror / custom/uk.list](https://github.com/hedrg/rules-mirror/blob/45585f484a0c6c2fba1faa4074fe0ebf269c1c05/custom/uk.list) | `e94fbcc7817c2c5bff4e76f765282e3f1b73d243` |
| S4 | [KujouYuko/ClashRules / Clash/Rules/UKBank.list](https://github.com/KujouYuko/ClashRules/blob/e399fe98be85ba102042d8b854f7cef01627052b/Clash/Rules/UKBank.list) | `56cb07da4b254d6322343f829e635f5e7dbde7a7` |
| S5 | [AdguardTeam/cname-trackers / data/trackers/lexisnexis-risk-solutions.md](https://github.com/AdguardTeam/cname-trackers/blob/d519e17ee10e2d1c5b2762a78a8e11ec2b38ce5a/data/trackers/lexisnexis-risk-solutions.md) | `9784fb7d55b7a0dad1c1414082532f9457bd9a1f` |
| S6 | [liandu2024/clash / list/wv/uk.list](https://github.com/liandu2024/clash/blob/681d30136e2d9b79fc93d310638cb7eca1e236e9/list/wv/uk.list) | `ca67f2c919e019cbbbfe53db68138dd1e961bd53` |
| S7 | [xOS/Config / RuleSet/UKOnly.list](https://github.com/xOS/Config/blob/58faa924d420f9ee67ae53df122569d07891f6d8/RuleSet/UKOnly.list) | `eef709bd60307a8942f461aae0e13765c332022d` |
| S8 | [m0zgen/dns-hole / regex/common-wl.txt](https://github.com/m0zgen/dns-hole/blob/de76599989d2b1f803fa1d3b699fbe956e1a9602/regex/common-wl.txt) | `3f74d8e862c36809b9249a04ab9352bdc7ecbf16` |
| S9 | [gdelmas/LloydsBank-MoneyMoney / Lloyds Bank UK.lua](https://github.com/gdelmas/LloydsBank-MoneyMoney/blob/ac8dc1743455439233bdfad0c0241dbda03e7f78/Lloyds%20Bank%20UK.lua) | `6067010a2d2562f6fe5426400473f88d52cf232d` |
| S10 | [chartingshow/crypto-firewall / src/blacklists/bank-phishing-filters/lloydsbank-com/adblock-list.txt](https://github.com/chartingshow/crypto-firewall/blob/fce2dd55bb73722d4111f97a42c73bc150163ded/src/blacklists/bank-phishing-filters/lloydsbank-com/adblock-list.txt) | `1bcf85dbc151bf7e1c1a77de3f19e5725dbbba2b` |
| R1 | [not-a-bank/open-banking-tracker-data / data/account-providers/lloyds.json](https://github.com/not-a-bank/open-banking-tracker-data/blob/f430c6c1c0f82a61c128cca1ec65912bbb2e0be6/data/account-providers/lloyds.json) | `ab68a0d03b1fd5f8cd83e1c7a8f314b62c5a8358` |
| R2 | [bank-io/aspsp-data / sandbox/lloyds-sandbox.json](https://github.com/bank-io/aspsp-data/blob/c8cafc87d9602a48f0a9c2e808b00ed17ca46a17/sandbox/lloyds-sandbox.json) | `29c07ccc29747facfe886e4413b54f46f4a356be` |
| R3 | [AdguardTeam/cname-trackers / data/trackers/lexisnexis-risk-solutions.json](https://github.com/AdguardTeam/cname-trackers/blob/d519e17ee10e2d1c5b2762a78a8e11ec2b38ce5a/data/trackers/lexisnexis-risk-solutions.json) | `60856c966dc2adfd38cf5adb216e8fc3534db0bd` |
| R4 | [easylist/easylist / easyprivacy/easyprivacy_specific_cname_adobe.txt](https://github.com/easylist/easylist/blob/b2dc428844d4c725ff94a30a688e5dfb65f45f1e/easyprivacy/easyprivacy_specific_cname_adobe.txt) | `560b8ac320f0126f2b93749b59bdaddc8d7e2fac` |
| R5 | [ftpmorph/ftprivacy / blocklists/smartphone-ads-tracking.txt](https://github.com/ftpmorph/ftprivacy/blob/510a4154154033e5457556df5fa661cff82be6b5/blocklists/smartphone-ads-tracking.txt) | `edb7b002aeeadebe59f2a36672ac1bff042045eb` |
| R6 | [duckduckgo/tracker-radar / domains/GB/lloydsbankinggroup.com.json](https://github.com/duckduckgo/tracker-radar/blob/a54ee0ccc2a90192123341f4842d2884d1832dc3/domains/GB/lloydsbankinggroup.com.json) | `917e108d9861ee5d30fe339f9c2a9ad2c9859658` |
| R7 | [duckduckgo/tracker-radar / domains/GB/dashboard.co.uk.json](https://github.com/duckduckgo/tracker-radar/blob/a54ee0ccc2a90192123341f4842d2884d1832dc3/domains/GB/dashboard.co.uk.json) | `735abfff621c3541558221723d3879a1f70fc914` |
| R8 | [duckduckgo/tracker-radar / domains/GB/dynatrace.com.json](https://github.com/duckduckgo/tracker-radar/blob/a54ee0ccc2a90192123341f4842d2884d1832dc3/domains/GB/dynatrace.com.json) | `becbaa5e909b3908cda27a607e8ecbbe430f7cb8` |
| R9 | [duckduckgo/tracker-radar / domains/GB/lloydsbank.co.uk.json](https://github.com/duckduckgo/tracker-radar/blob/a54ee0ccc2a90192123341f4842d2884d1832dc3/domains/GB/lloydsbank.co.uk.json) | `6c6932c4bd18c3d948be51dcf2a2f14bd0728556` |
| R10 | [AdguardTeam/AdGuardSDNSFilter / Filters/exceptions.txt](https://github.com/AdguardTeam/AdGuardSDNSFilter/blob/b1735f55a0bda225883a9099ff69538bc91c173d/Filters/exceptions.txt) | `2e88109ad14ab39a7cbba8adbdd5e1c236ca7c17` |

## 已读取的问题记录及完整后续讨论

R11 是 Android 12，R12 未注明平台；二者不能标为 iOS 已测试。R13 具有撤回结论，不能只引用原始标题。R10 的 Lloyds 例外对应其前置问题引用 #1720，下一条 #1717 属于新浪内容，未当成 Lloyds 证据。

- **R11**：[Device authentication failure report; maintainer associates the Adobe tenant hostname; DNS fix deployment remained disputed in later comments. Not iOS evidence.](https://github.com/AdguardTeam/AdGuardSDNSFilter/issues/1720)
- **R12**：[Reporter says unblocking lloydsbankinggroup.tt.omtrdc.net restored the bank app; maintainer added an exception. Not a controlled iOS test.](https://github.com/hagezi/dns-blocklists/issues/3025)
- **R13**：[Three-host report was subsequently retracted as a false alarm; d3.sc.omtrdc.net and Qualtrics entries are not promoted.](https://github.com/hagezi/dns-blocklists/issues/3020)

## 官方和直接读取来源

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
- **O9**：[Official personal consent/OIDC/API hosts and App-to-App flow; public documentation is not a private native App endpoint inventory. Web reader succeeded; direct Node request returned HTTP 500.](https://developer.lloydsbanking.com/prod01/lbg/lbg-support)
- **O10**：[Public Internet Banking login HTML; not a captured iOS session](https://online.lloydsbank.co.uk/personal/logon/login.jsp)
- **O11**：[Public bank homepage HTML; navigation and resource links only](https://www.lloydsbank.com/)
- **O12**：[Public Apple app metadata, no binary download or runtime test](https://itunes.apple.com/lookup?id=469964520&country=gb)
- **O13**：[Public Universal Links association; not an API inventory](https://www.lloydsbank.com/.well-known/apple-app-site-association)

O9 通过网页读取器成功读取，Node 直连返回 500，未将 500 当作无业务证据。O10/O11 是未登录公开网页 GET，不保存响应 Cookie 或完整动态 HTML；摘要散列和提取到的主机见来源文件。O10 内容会变化，先后响应出现的资源主机不完全相同；网页观测只能支持网页关联。当前 DNS 解析不是归属的唯一证据。TrackerControl iOS 页面读取返回 403，因此未将其搜索摘要计入实测或推断租户域名。

## 完整去重清单：哪些覆盖、哪些未覆盖

表中“扩展”指核心之外新增匹配；CDN 子树本身是规则基域，非声称实测请求。“候选”和“不订阅”均未自动转入规则；未被订阅不表示拒绝。

| 域名/主机 | 类别 | 当前覆盖 | 用途/判定 | 证据 | 可信度 | iOS 实测 |
| --- | --- | --- | --- | --- | --- | --- |
| `amazontrust.com` | C | 不订阅 | 共享服务后缀，缺少可限定 Lloyds 个人 App 的主机证据，不订阅、不阻断。 | S2, O7 | association-only | 无 |
| `analytics.data.lloydsbankinggroup.com` | A | 候选，未覆盖 | Group analytics alias; no present iOS business necessity | R4, D2 | medium-web-association | 无 |
| `answers.lloydsbank.com` | A | 核心 | Official homepage navigation; already matched, not necessarily personal native App traffic | O11 | high-web-reference | 无 |
| `api.lloydsbank.co.uk` | A | 核心 | Community-listed API/mobile host; present-day native endpoint use unverified | S1 | low-current-usage | 无 |
| `apply.lloydsbank.co.uk` | A | 核心 | Official homepage navigation; already matched, not necessarily personal native App traffic | O11 | high-web-reference | 无 |
| `as.aspsp.sandbox.lloydsbanking.com` | A | 不订阅 | Explicit sandbox endpoint; production native App use not established | R2 | high-sandbox-purpose | 无 |
| `authorise-api.lloydsbank.co.uk` | A | 核心 | Official production Open Banking consent/OIDC or mTLS API; not necessarily native account API | O9, D2 | high-official-purpose | 无 |
| `authorise.lloydsbank.co.uk` | A | 核心 | Official production Open Banking consent/OIDC or mTLS API; not necessarily native account API | O9, D2 | high-official-purpose | 无 |
| `bcdn-16c9d93d.lloydsbank.co.uk` | A | 核心 | Public login HTML resource/configuration host; exact service semantics and native use unverified | O10 | high-current-web-reference | 无 |
| `bf10006sbr.bf.dynatrace.com` | C | 扩展 | Specific monitoring tenant embedded in the current personal login HTML | O10, R8 | medium-current-web-reference | 无 |
| `branches.lloydsbank.com` | A | 核心 | Official homepage navigation; already matched, not necessarily personal native App traffic | O11 | high-web-reference | 无 |
| `cbcdn.lloydsbank.com` | A | 核心 | Bank corporate/service context; personal App use unverified | S5, R3 | medium-CNAME-association | 无 |
| `cdn.lloydsbanking.com` | A | 扩展 | Bank CDN namespace used by current personal login, consent and API CNAMEs | O2, O9, D2 | high-bank-CDN-association | 无 |
| `check2.lloydsbank.co.uk` | A | 核心 | Bank risk-service alias | S5, R3 | medium-CNAME-association | 无 |
| `cib.currency.lloydsbank.com` | A | 核心 | Corporate currency context | S5, R3 | medium-CNAME-association | 无 |
| `cm.everesttech.net` | C | 不订阅 | 共享服务后缀，缺少可限定 Lloyds 个人 App 的主机证据，不订阅、不阻断。 | S2 | association-only | 无 |
| `data.lloydsbankinggroup.com.data.adobedc.net` | C | 不订阅 | Analytics CNAME target, not an observed direct App request | D2 | medium-alias-only | 无 |
| `demdex.net` | C | 不订阅 | 共享服务后缀，缺少可限定 Lloyds 个人 App 的主机证据，不订阅、不阻断。 | S2 | association-only | 无 |
| `developer.lloydsbanking.com` | A | 不订阅 | Public TPP developer portal, not a personal App endpoint | O9, R1 | high-development-purpose | 无 |
| `dynatrace.com` | C | 不订阅 | 共享服务后缀，缺少可限定 Lloyds 个人 App 的主机证据，不订阅、不阻断。 | S2, S8, O6 | association-only | 无 |
| `ela1.bankofscotland.co.uk` | A | 不订阅 | Other bank CNAME alias | S5, R3 | high-other-brand | 无 |
| `h-lloyds-cib.online-metrix.net` | C | 不订阅 | 企业/其他品牌上下文，不能当作个人 App 依赖。 | S5 | association-only | 无 |
| `h-lloyds-soc.online-metrix.net` | C | 不订阅 | 企业/其他品牌上下文，不能当作个人 App 依赖。 | S5 | association-only | 无 |
| `h-lloydsbank.online-metrix.net` | C | 候选，未覆盖 | CNAME 数据显示对应 check2.lloydsbank.co.uk；尚无个人 iOS App 直接请求/必要性证据。 | S5 | association-only | 无 |
| `h-lloydsboscorporate.online-metrix.net` | C | 不订阅 | 企业/其他品牌上下文，不能当作个人 App 依赖。 | S5 | association-only | 无 |
| `h-lloydscorporate.online-metrix.net` | C | 不订阅 | 企业/其他品牌上下文，不能当作个人 App 依赖。 | S5 | association-only | 无 |
| `h-lloydslink.online-metrix.net` | C | 不订阅 | 企业/其他品牌上下文，不能当作个人 App 依赖。 | S5 | association-only | 无 |
| `home-quote.lloydsbank.com` | A | 核心 | Official homepage navigation; already matched, not necessarily personal native App traffic | O11 | high-web-reference | 无 |
| `js-cdn.dynatrace.com` | C | 不订阅 | Shared vendor JavaScript loader on public bank homepage | O11 | high-shared-service | 无 |
| `lab4.lloydsbank.com` | A | 核心 | LloydsLink context | S5, R3 | medium-CNAME-association | 无 |
| `lloydsbank-online.co.uk` | A | 核心 | 官方个人银行/授权命名空间 | S1, O3 | high-ownership | 无 |
| `lloydsbank.co.uk` | A | 核心 | 官方个人银行/授权命名空间 | S1, S2, S3, S4, S8, S9, O2 | high-ownership | 无 |
| `lloydsbank.com` | A | 核心 | 官方个人银行/授权命名空间 | S1, S3, S4, S6, S8, O1 | high-ownership | 无 |
| `lloydsbank.info` | B | 候选，未覆盖 | 归属/用途未获官方证实；另在品牌防钓鱼模式列表出现，不能仅凭名单定性恶意。 | S1, S10 | association-only | 无 |
| `lloydsbanking.com` | A | 不订阅 | Official group namespace. Only the reviewed CDN subtree or delivery host is enabled in the extension; no blanket group suffix. | O5 | high-ownership | 无 |
| `lloydsbankinggroup.com` | A | 不订阅 | Official group namespace. Only the reviewed CDN subtree or delivery host is enabled in the extension; no blanket group suffix. | S1, S3, O4 | high-ownership | 无 |
| `lloydsbankinggroup.d3.sc.omtrdc.net` | C | 候选，未覆盖 | Analytics host in subsequently retracted multi-host App report | R13 | low-retracted-report | 无 |
| `lloydsbankinggroup.tt.omtrdc.net` | C | 扩展 | Adobe Target tenant implicated in bank App device-authentication availability | R10, R11, R12, D2 | medium-app-reported | 无 |
| `logs-16c9d93d.lloydsbank.co.uk` | A | 核心 | Group web logging endpoint in crawler data; records shown on other group brands | R9 | medium-web-observed | 无 |
| `lp-01.asynchronousmessaging.dashboard.co.uk` | C | 候选，未覆盖 | Group web chat/messaging resource; shared across brands, no iOS-specific proof | R7 | medium-web-observed | 无 |
| `lp-07.asynchronousmessaging.dashboard.co.uk` | C | 候选，未覆盖 | Group web chat/messaging resource; shared across brands, no iOS-specific proof | R7 | medium-web-observed | 无 |
| `lpcdn.asynchronousmessaging.dashboard.co.uk` | C | 候选，未覆盖 | Group web chat/messaging resource; shared across brands, no iOS-specific proof | R7 | medium-web-observed | 无 |
| `matls.as.aspsp.sandbox.lloydsbanking.com` | A | 不订阅 | Explicit sandbox endpoint; production native App use not established | R2 | high-sandbox-purpose | 无 |
| `matls.rs.aspsp.sandbox.lloydsbanking.com` | A | 不订阅 | Explicit sandbox endpoint; production native App use not established | R2 | high-sandbox-purpose | 无 |
| `mobile.lloydsbank.co.uk` | A | 核心 | Community-listed API/mobile host; present-day native endpoint use unverified | S1 | low-current-usage | 无 |
| `mortgages.secure.lloydsbank.co.uk` | A | 核心 | Official homepage navigation; already matched, not necessarily personal native App traffic | O11 | high-web-reference | 无 |
| `omtrdc.net` | C | 不订阅 | 共享服务后缀，缺少可限定 Lloyds 个人 App 的主机证据，不订阅、不阻断。 | S2 | association-only | 无 |
| `online-metrix.net` | C | 不订阅 | 共享服务后缀，缺少可限定 Lloyds 个人 App 的主机证据，不订阅、不阻断。 | S2, S5, O8 | association-only | 无 |
| `online.lloydsbank.co.uk` | A | 核心 | Personal Internet Banking login | O2, O10 | high-official-purpose | 无 |
| `onlinebusiness.lloydsbank.co.uk` | A | 核心 | Official homepage navigation; already matched, not necessarily personal native App traffic | O11 | high-web-reference | 无 |
| `optimisation.data.lloydsbankinggroup.com` | A | 扩展 | Group content/personalisation delivery seen on the personal login site | R4, R6, D2 | medium-web-observed | 无 |
| `s10190.cdn.lloydsbanking.com` | A | 扩展 | DNS target of official bank login, website, consent or API host | D2 | high-CDN-association | 无 |
| `s13966.cdn.lloydsbanking.com` | A | 扩展 | DNS target of official bank login, website, consent or API host | D2 | high-CDN-association | 无 |
| `s16370.cdn.lloydsbanking.com` | A | 扩展 | DNS target of official bank login, website, consent or API host | D2 | high-CDN-association | 无 |
| `s3031.cdn.lloydsbanking.com` | A | 扩展 | DNS target of official bank login, website, consent or API host | D2 | high-CDN-association | 无 |
| `s37706.cdn.lloydsbanking.com` | A | 扩展 | DNS target of official bank login, website, consent or API host | D2 | high-CDN-association | 无 |
| `s5933.cdn.lloydsbanking.com` | A | 扩展 | DNS target of official bank login, website, consent or API host | D2 | high-CDN-association | 无 |
| `secure-api-eidas.lloydsbank.com` | A | 核心 | Official production Open Banking consent/OIDC or mTLS API; not necessarily native account API | O9, D2 | high-official-purpose | 无 |
| `secure-api.lloydsbank.com` | A | 核心 | Official production Open Banking consent/OIDC or mTLS API; not necessarily native account API | O9, D2 | high-official-purpose | 无 |
| `threatmetrix.com` | C | 不订阅 | 共享服务后缀，缺少可限定 Lloyds 个人 App 的主机证据，不订阅、不阻断。 | O8 | association-only | 无 |
| `wup-16c9d93d.lloydsbank.co.uk` | A | 核心 | Public login HTML resource/configuration host; exact service semantics and native use unverified | O10 | high-current-web-reference | 无 |
| `ww9.lloydsbank.com` | A | 核心 | Corporate context | S5, R3 | medium-CNAME-association | 无 |
| `www.investments.lloydsbank.com` | A | 核心 | Official homepage navigation; already matched, not necessarily personal native App traffic | O11 | high-web-reference | 无 |
| `www.lloydsbank.com` | A | 核心 | Official website and iOS Universal Links association | O1, O11, O13 | high-official-purpose | 无 |
| `zn3wyma4xs4oqh2ct-lloydsbankinggroup.siteintercept.qualtrics.com` | C | 候选，未覆盖 | Survey/intercept host in subsequently retracted report; necessity disputed | R13 | low-retracted-report | 无 |

## 边界、验证与后续

不使用 PROCESS-NAME、USER-AGENT、关键词、未核实 IP、公共 co.uk/uk 后缀或 MITM。两集合不含策略名，只在配置示例中绑定已核实的 Kraken英国固定。不修改原配置、不改变银行安全流程，也不以屏蔽安全服务测试绕过。

两文件合并没有重复或后缀冗余，候选和其他品牌自有域名不匹配。集团 CDN、交付/监控租户本身可能跨品牌：这是明确说明的可选扩展影响，不承诺按 App 隔离。核心原有后缀也可能覆盖商业和集团共用主机。

真正未解决的是当前 iOS App 原生业务请求的实测归因：登录/设备验证、账户、卡管理、交易记录各阶段是否仍有未知主机。按 [README](README.md) 在本地观察并脱敏，再运行离线比较；原始日志、Cookie、Token、账号/卡号、请求体及个人信息不上传、不提交。静态结果不等于运行通过。
