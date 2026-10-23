# Lloyds 统一正式规则：验证记录

日期：2026-10-23（Europe/London）。修改现有 daixianglong199-dotcom/lloyds-rules 的 main，基线为 [3e3cbc770a73f6e1d59d427895d484b7be3537c2](https://github.com/daixianglong199-dotcom/lloyds-rules/commit/3e3cbc770a73f6e1d59d427895d484b7be3537c2)。本轮只合并既有有效规则，不新增域名、不提升证据可信度。

## 实际静态检查

`node validate.mjs`、`node --check validate.mjs`、`git diff --check` 均通过。规则使用 Loon 的 DOMAIN / DOMAIN-SUFFIX 两列格式，UTF-8 无 BOM，文件内无策略名。

| 检查 | 结果 |
| --- | --- |
| 正式订阅入口 | 仅 Lloyds/Lloyds-UK.list，原 Raw 地址不变 |
| 有效规则 | 7 条，逐条等于用户指定集合 |
| 类型 | 4 条互不覆盖的 DOMAIN-SUFFIX + 3 条精确 DOMAIN |
| 证据层级 | 核心来源 3 条 + 扩展来源 4 条；均在同一正式文件 |
| 重复 / 后缀冗余 | 0 / 0 |
| 共享供应商整个后缀 / 其他银行自有域名 | 0 / 0 |
| 候选隔离 | 8 个候选均未匹配，candidates.list 无可执行行 |
| 覆盖统计 | 65 个审核条目，17 个可注册域名；正式覆盖 36 = 核心来源 26 + 扩展来源 10；其余 8 个候选、21 个排除/范围限定 |
| iOS 实测 | 0；所有原有来源、可信度和 iOS 标志逐条与基线比较一致 |
| 弃用兼容文件 | Extended 保留原 4 条有效规则，必须等于正式文件的扩展来源子集，不另计总数 |
| 订阅示例 | 仅一条真实 Raw URL，绑定现有 Kraken英国固定 |
| 校验器正反例 | 45 项通过 |
| 本轮集成回归 | 7 项通过，见下文 |

本轮 7 项回归分别检查：缺少指定规则、候选擅自加入、兼容文件缺少弃用标记、兼容子集偏离、示例误含两条订阅、正式规则统计过期、候选文件含可执行行；校验器全部拒绝。使用忽略目录 private/ 内的合成副本，不改写正式文件。

纯合成主机增量测试通过：核心授权主机、CDN/Adobe 主机、候选、已知未路由与未知主机分类正确；完整 URL 输入被拒绝且不回显，测试前后两个规则文件字节不变。`--hosts` 的 core_covered / extension_covered 标签表示统一正式订阅内的证据来源，不是两个订阅。

| 文件 | SHA-256 |
| --- | --- |
| Lloyds-UK.list | `ea88f69ee8b49bf04b6e95554977df894a27bbdb1fe38fd370b4c5243bba6e42` |
| Lloyds-UK-Extended.list（弃用兼容） | `c84e2d1df7febf2b9ba9e36aa59d84be23d262a460572f1fa3efe3d33baf8002` |

## 策略、隐私与范围

只读复核原有 Loon-Main.lcf 和 Loon-Main.GitHub.lcf，均存在 `Kraken英国固定 = select,英国节点`。未编辑配置，不创建新策略组。共享该组的 Kraken 也会受组内节点选择影响；未确认手机当前实际出口。

无 MITM、证书解密、重写、REJECT、IP、关键词、UA 或进程规则。静态凭据/私钥基础扫描通过；未处理或提交真实银行日志、Cookie、Token、卡号、账户或个人资料。域名路由无法按 App 隔离集团共享 CDN/租户。

## 发布与订阅验证

系统 Git 非交互推送因凭据存储不可用失败；采用已登录 daixianglong199-dotcom 的 GitHub 标准网页编辑器向现有 main 提交，不使用 lonng6 写入，不创建仓库、不强推。本地完整修改提交保留在 codex/local-before-unified-publication，发布后公开拉取远程历史并比较完整 Git tree。

2026-10-23T14:30:53.281Z：匿名 GET 已核对本报告之外全部 12 个跟踪文件，均为 HTTP 200 且与本地逐字节一致；正式 Raw 已确认恰好 7 条有效规则。报告发布后再核对完整 13 个文件和 Git tree，最终结果在本任务交付记录中报告。

唯一订阅（删除旧 Extended 订阅）：

```ini
[Remote Rule]
https://raw.githubusercontent.com/daixianglong199-dotcom/lloyds-rules/main/Lloyds/Lloyds-UK.list, policy=Kraken英国固定, tag=Lloyds-UK, enabled=true
```

## 尚未完成的设备验证

本轮不增加研究证据，不代表 iOS 实际业务验证。扩展来源仍基于网页、DNS 或历史 Android/平台未明报告；h-lloydsbank.online-metrix.net 等候选不纳入。没有当前 iOS 登录、设备验证、账户、卡管理和交易记录请求日志，不能声称完整覆盖。后续按照 [README](README.md) 在本地观察、人工脱敏后仅提供纯主机名增量比较，不需要 HTTPS 解密。

可用历史提交固定 Raw 版本或正常 git revert 回滚；合并前基线同一路径仅含原 3 条核心规则。当前正式入口不再要求独立扩展订阅。
