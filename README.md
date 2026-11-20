# Surge Modules

遵循 [Surge 官方文档规范](https://nssurge.com/llms.txt)（Surge Manual & Beta Release Log）由 Loon 插件转换而来的 Surge 专用独立模块（`.sgmodule`）。

所有模块均已脱离 `Block_HTTPDNS` / `BlockAdvertisers` 全局基石插件，按需拆分并内置各自实际依赖的广告联盟与 HTTPDNS 规则，**每个模块均可单独订阅启用**。

## 模块订阅列表

| 模块名称 | 说明 | Raw 订阅链接 |
| --- | --- | --- |
| **QQ音乐去广告** | 过滤 QQ 音乐广告；已拆分内置 QQ 音乐/腾讯优量汇广告统计及通用/DNSPod HTTPDNS 规则（无需 MITM） | `https://raw.githubusercontent.com/TO8E/surge/main/modules/QQMusic_remove_ads.sgmodule` |
| **酷安去广告** | 过滤酷安开屏、信息流、评论区与热搜广告，外链 302 重定向；已拆分内置穿山甲/优量汇/快手/百度/倍孜/京东/Sigmob/友盟及阿里/腾讯/百度/京东 HTTPDNS 规则（需 Surge iOS 5.14.0+ / Mac 5.9.0+ 并开启 MITM） | `https://raw.githubusercontent.com/TO8E/surge/main/modules/CoolApk.sgmodule` |

## 转换规范说明

- **独立解耦**：不单独生成全局 `Block_HTTPDNS` / `BlockAdvertisers` 模块，仅按应用实际依赖拆分对应规则写入各模块。
- **元数据规范**：仅使用 Surge 官方支持的 `#!name`、`#!desc`、`#!requirement` 指令，移除 Loon 专有字段。
- **规则优化**：
  - 域名规则置于 IP 规则之前；对无 `DIRECT` 放行冲突的 `REJECT` 域名/IP 规则启用 `pre-matching`。
  - 保留字节跳动 `tnc` 与嘀嗒出行的 `DIRECT` 放行顺序，不对其冲突规则加 `pre-matching`。
- **原生重写与脚本**：
  - Loon `reject_dict(200)` → Surge `[Map Local]` 内联文本 JSON 响应。
  - Loon `response.json.jq(...)` → Surge 原生 `[Body Rewrite]` `http-response-jq`（单引号包裹表达式，无需二次转义；并将 `(?i)` 置于 host 之后以保留 Surge 6.13+ 的 host 前缀优化）。
  - Loon `[Script]` → Surge 现代 `key = type=...,pattern=...,script-path=...,engine=jsc` 语法。
  - `[MITM]` 严格使用 `hostname = %APPEND% ...`。
- **官方校验**：所有模块均通过 Surge 官方校验服务（`https://services.nssurge.com/v1/config/validate`，Surge 6.12.0 解析器）单模块及合并校验。
