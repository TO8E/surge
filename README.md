# Surge Modules

遵循 [Surge 官方文档规范](https://nssurge.com/llms.txt)（Surge Manual & Beta Release Log）转换并校验的 Surge 专用模块（`.sgmodule`）。

## 模块订阅列表

| 模块名称 | 说明 | Raw 订阅链接 |
| --- | --- | --- |
| **QQ音乐去广告** | 过滤 QQ 音乐广告；已内置来自 `Block_HTTPDNS`（通用/DNSPod）与 `BlockAdvertisers`（QQ 音乐及腾讯优量汇/统计）的公共依赖规则，**可单独启用** | `https://raw.githubusercontent.com/TO8E/surge/main/modules/QQMusic_remove_ads.sgmodule` |
| **HTTPDNS 拦截器** | 基石模块：拦截常见 HTTPDNS 服务，避免应用绕过 Surge DNS 规则框架（需开启 Rewrite 与 MITM 以使 `[Map Local]` 生效） | `https://raw.githubusercontent.com/TO8E/surge/main/modules/Block_HTTPDNS.sgmodule` |
| **广告平台拦截器** | 基石模块：拦截主流第三方广告平台与 SDK 广告请求（含腾讯优量汇、穿山甲、快手、百度、阿里、友盟、极光、个推等） | `https://raw.githubusercontent.com/TO8E/surge/main/modules/BlockAdvertisers.sgmodule` |

## 转换说明

- **元数据规范**：仅保留 Surge 官方模块指令（`#!name`、`#!desc`、`#!requirement`），移除 Loon 专有字段（如 `#!loon_version`、`#!openUrl`、空 `#!system=` 等）。
- **规则优化**：
  - 按 Surge 官方建议将域名规则置于 IP 规则之前，减少不必要的 DNS 解析。
  - 为无 `DIRECT` 放行冲突的 `REJECT` 域名/IP 规则启用 `pre-matching`，在 DNS/TCP 握手阶段低开销拦截。
  - 保留 `BlockAdvertisers` 中字节跳动 `tnc`、Mob 短信、极光认证及 `Block_HTTPDNS` 中嘀嗒出行的 `DIRECT` 放行优先级，不对其冲突规则加 `pre-matching`。
  - 去除原 Loon 插件中的重复规则及 `USER-AGENT` / `URL-REGEX` 冗余引号与 `\/` 转义。
- **重写转换**：将 Loon 3.x `[Rewrite]` DSL（`reject_dict(200)` / `reject(404)`）转换为 Surge 原生 `[Map Local]` 内联文本响应（并声明 `#!requirement=CORE_VERSION>=20`）。
- **MITM 合并**：严格使用 `[MITM]` 与 `hostname = %APPEND% ...`，避免覆盖主配置已有的 MITM 列表。
- **官方校验**：所有模块均已通过 Surge 官方校验服务（`https://services.nssurge.com/v1/config/validate`，Surge 6.12.0 解析器）单模块及合并校验。
