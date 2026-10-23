# 检查与发布记录

检查日期：2026-10-23（Europe/London）。本项目只新增独立 `lloyds-rules` 目录，不修改 Kraken、WorldFirst 或任何本地 Loon 配置。对开始任务时的 **3,767 个已有文件**逐一复核 SHA-256，变化数为 **0**。

## 静态检查

执行：在仓库根目录运行 `node validate.mjs`，结果 PASS。

| 项目 | 结果 |
| --- | --- |
| 正式规则 | 3 条，全部 DOMAIN-SUFFIX，UTF-8 无 BOM |
| 重复/后缀冗余 | 0 / 0 |
| 第三方共享后缀 | 0 |
| 其他银行/App 自有域名 | 0 |
| 策略名、关键词、进程、UA、IP 规则 | 0 |
| 候选 | 4 个审核对象，候选文件 0 条可执行行 |
| GitHub 文件证据 | 10 个固定提交文件，另读取 AdGuard 说明及域名清单、Loon 官方示例 |
| 校验器自检 | 35 个正反例检查，包含共享后缀、重复、后缀覆盖、仿冒拼接和不支持语法 |
| 初始正式文件 SHA-256 | `1f1e1523e4280b1c1ef2823722bd7887e0d46972a15de077b616bbdb282fe785` |

语法依据 [Loon 域名规则](https://nsloon.app/docs/Rule/domain_rule/) 和 [官方配置示例](https://github.com/Loon0x00/LoonExampleConfig/blob/master/example.conf)。这是静态检查，**不是 iOS Loon 运行测试或真实银行业务验证**。

主机比较工具完全离线，只接受经人工审查的纯主机名单。工具不自动写入规则；缺少 iOS 版本/业务阶段的记录时，不能将“未覆盖”视为“必须添加”。基础凭据扫描不代表完整隐私保证。

## GitHub 身份与发布状态

- GitHub 连接器已核实：`lonng6`。没有改向此账号创建或提交仓库。
- Chrome 网页用户菜单及创建仓库表单已核实：`daixianglong199-dotcom`。已由该账号创建正确的公开仓库并向 `main` 提交本任务文件，网页提交证明具备实际写权限。
- 本地已初始化独立仓库，主分支 `main`，远程 `origin` 指向 `https://github.com/daixianglong199-dotcom/lloyds-rules.git`。
- **已发布**：使用该账号的 GitHub 网页编辑器提交，未使用 `lonng6` 写入。系统 Git 没有可用推送凭据，禁用交互的 `git push` 尝试失败；因此不声称命令行推送成功。没有导出网页 Cookie、创建 Token 或扩大浏览器扩展权限。
- 网页批量文件上传因扩展未获本地文件 URL 访问权限而不可用，改用标准网页编辑器逐文件提交。每次提交仅涉及本项目文件，未改动其他仓库。
- 初始正式规则提交：[2f930ef0561f4d37f8a76bcc8727836857b896e7](https://github.com/daixianglong199-dotcom/lloyds-rules/commit/2f930ef0561f4d37f8a76bcc8727836857b896e7)。该提交可用作固定版本或回滚参照。
- 本地初始提交 `09e5096` 及后续准备记录保留在 `codex/local-pre-web-publication` 分支；本地 `main` 对齐实际远程网页提交历史，不强推、不删除历史。

已验证的目标文件与 Raw 地址：

```text
https://github.com/daixianglong199-dotcom/lloyds-rules/blob/main/Lloyds/Lloyds-UK.list
https://raw.githubusercontent.com/daixianglong199-dotcom/lloyds-rules/main/Lloyds/Lloyds-UK.list
```

2026-10-23 14:29 BST（13:29 UTC），使用匿名 HTTPS GET 检查正式 Raw：**HTTP 200**，`text/plain; charset=utf-8`，**393 字节**，SHA-256 为上表值，和本地文件逐字节一致。随后复核本报告以外的全部 9 个文件，均 HTTP 200 且逐字节一致；报告发布后再次做完整仓库核对。

本报告和 GitHub 全部文件地址均位于上述独立仓库。可使用公开 Git 的 fetch 拉取实际历史；后续命令行写入仍需要以 `daixianglong199-dotcom` 正常登录 Git Credential Manager 或 GitHub CLI。

若后续需要从命令行更新：

1. 使用已有公开仓库 `daixianglong199-dotcom/lloyds-rules`，不要重新创建或改向其他账号。
2. 使用系统 Git Credential Manager 或 GitHub CLI 的正常交互登录同一账号，不把凭据放入命令、URL 或文件。
3. 在本地独立仓库根目录先 `git pull --ff-only`，修改后运行 `node validate.mjs`、`git diff --check`，只提交审查过的任务文件，再执行 `git push origin main`。不要强推。
4. 匿名 GET Raw URL，必须 HTTP 200，且下载内容与本地正式文件逐字节或 SHA-256 一致；再导入 Loon。

## 尚未完成的实机验证

登录、账户查询、银行卡管理、交易记录的完整网络覆盖仍待用户设备上的 Loon 请求记录验证。认证、反欺诈、证书检查是否被现有配置误拦截也未验证；本项目未改变它们的请求内容、目标和验证流程。

不抓取、不提交 Cookie、Token、卡号、账号、请求体或身份信息。增量方法与脱敏边界见 [README](README.md)。
