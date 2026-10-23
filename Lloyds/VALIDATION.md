# Lloyds 核心与扩展：检查和发布记录

日期：2026-10-23（Europe/London）。本轮只更新现有 daixianglong199-dotcom/lloyds-rules，基线提交为 [6a6d29835e1024caa021f6f80ee6e3f2025b9ca4](https://github.com/daixianglong199-dotcom/lloyds-rules/commit/6a6d29835e1024caa021f6f80ee6e3f2025b9ca4)。不新建仓库、不修改其他项目或本地 Loon 配置。

## 实际执行的静态验证

在仓库根目录运行 `node validate.mjs`，结果 PASS。按照 [Loon 域名规则](https://nsloon.app/docs/Rule/domain_rule/) 和 [官方配置示例](https://github.com/Loon0x00/LoonExampleConfig/blob/master/example.conf) 检查两个文件单独及合并语法；这不是运行 Loon 或完成银行登录。

| 项目 | 结果 |
| --- | --- |
| 核心规则 | 3 条 DOMAIN-SUFFIX，覆盖范围兼容原版；更新注释及 API/扩展指引 |
| 可选扩展 | 4 条：1 个银行 CDN 子后缀 + 3 个具体服务主机 |
| 合并后 | 4 个独立后缀匹配、3 个精确主机匹配，共 7 条 |
| 重复/后缀覆盖冗余 | 0 / 0，合并检查也通过 |
| 整个集团根后缀 | 0，改用 CDN 子树及具体交付主机 |
| 供应商共享根后缀 | 0，禁止 Dynatrace/Amazon Trust/Online Metrix/Adobe 等整个服务后缀 |
| 其他银行/App 自有域名 | 0；集团 CDN/租户可能跨品牌，不能按 App 完全隔离 |
| 策略名、UA、进程、关键词、IP 写入规则文件 | 0 |
| 候选隔离 | 8 个候选，候选文件全部注释，两个订阅均不会命中候选 |
| 校验器正反例 | 45 个，覆盖拼接仿冒、精确主机边界、CDN 子树边界、共享后缀、重复及语法错误 |
| 来源 | 实际读取 20 个固定提交 GitHub 文件，另读取 3 个问题及全部评论、官方技术文档与公开页面 |
| 完整审计清单 | 65 个去重条目，涉及 17 个可注册域名；26 核心 + 10 扩展新增 + 8 候选 + 21 排除/根域限定 |
| 统计一致性 | 校验器从规则重算并逐项验证 coverage-summary.json 和 sources.json 标记 |
| iOS 实机验证 | 0；公开 Apple/AASA 关联、银行网页请求和 Android 报告分开标注 |

两文件均 UTF-8 无 BOM，策略名称只出现在远程订阅示例中。

| 文件 | SHA-256 |
| --- | --- |
| Lloyds-UK.list | `b170efbd1a8913672dec20842eecb5163949a5feab7a5955130c4fc40e168867` |
| Lloyds-UK-Extended.list | `24edc75c0dc8d5938d5be75f1cfe01756e74bc09700e72d9b3f55f27bac8f2dd` |

## 增量比较工具集成检查

使用纯合成主机名单执行 `--hosts`：确认核心授权主机、CDN 与 Adobe 扩展主机、风险/未核实候选、已知开发门户和未知示例主机分别落入五种分类。测试完整 URL 输入被拒绝、不回显输入 URL，两个规则文件测试前后字节不变。没有使用或上传任何真实账户日志。

凭据/私钥基础模式扫描通过；研究工作文件全部存于被忽略的 private/，不提交网页原文、响应 Cookie、原始日志、Token、账户或卡号。

## 原配置策略检查

只读检查原有 Loon-Main.lcf 和 Loon-Main.GitHub.lcf，两者第 50 行都有 `Kraken英国固定 = select,英国节点`。对应 `英国节点` 筛选已存在。生成 [Loon-RemoteRule.example.conf](Loon-RemoteRule.example.conf)，两条真实 Raw URL 都绑定这个现有策略，未使用策略占位符，也未编辑上述配置文件。

该组与 Kraken 共用；修改组内选择会同时影响引用它的服务。没有访问手机的实际运行状态，不能保证当前所选节点确在英国，也不能保证现有拦截规则已放行所有安全请求。

## 发布状态

已通过 **daixianglong199-dotcom 的 GitHub 网页会话**提交更新到现有仓库 main。GitHub 连接器账号仍为 lonng6，未使用它写入。系统 Git 非交互推送因缺少可用凭据失败，因此不声称命令行 git push 成功；本轮采用标准网页编辑器发布后，通过匿名公开 Git 拉取同步历史。

本地研究提交 40cca78 及最终记录保留在 codex/local-before-extension-publication 分支；main 对齐实际远程提交。只提交 11 个任务相关修改/新增文件，完整仓库为 13 个跟踪文件，没有新建其他仓库，没有强推、导出 Cookie、创建 Token 或扩大浏览器权限。

2026-10-23 **15:01 BST（14:01 UTC）**，匿名 GET 核对本报告以外全部 **12 个文件**，均为 HTTP 200，且与本地逐字节一致；包含核心、扩展、示例配置、来源、审计和校验工具。规则 SHA-256 与上表一致。本报告发布后，再执行完整 13 文件核对及本地/远程 Git tree 一致性检查。

对工作目录中本项目之外的 **3,767 个已有文件**重新计算 SHA-256，变化数 **0**。包含原 Loon 配置及 Kraken、WorldFirst 项目；没有上传这些文件。

可用订阅地址：

```text
https://raw.githubusercontent.com/daixianglong199-dotcom/lloyds-rules/main/Lloyds/Lloyds-UK.list
https://raw.githubusercontent.com/daixianglong199-dotcom/lloyds-rules/main/Lloyds/Lloyds-UK-Extended.list
```

后续命令行写入需要在系统正常登录 daixianglong199-dotcom 的 Git Credential Manager 或 GitHub CLI；不要把凭据放入 URL、配置或仓库。网页提交已完成发布，不能把本地备份提交直接强推覆盖网页历史。

原版公开发布已保存在基线提交中；核心订阅路径继续兼容。新增扩展文件为可选增量，不将候选自动合并。每次提交只包含本任务文件，历史可回滚。

## 仍需设备端验证

没有实际登录、账户查询、卡管理、交易记录的当前 iOS 连接日志，因此不声称完整覆盖或 iOS 认证已经通过。h-lloydsbank.online-metrix.net 保留候选；其他共享服务、被撤回的故障报告和沙箱主机不强制加入。

后续按 [README](README.md) 的纯主机名方式增量比对，先验证阶段归因，再核实归属和共享性。不得上传或提交 Cookie、Token、账户/银行卡资料、请求体或个人身份信息；不需要 MITM 或解除设备安全限制。
