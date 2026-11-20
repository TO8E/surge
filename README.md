# Surge Modules

遵循 [Surge 官方文档规范](https://nssurge.com/llms.txt)（Surge Manual & Beta Release Log）由 Loon 插件转换而来的 Surge 专用独立模块（`.sgmodule`）。

所有来自 `kelee.one` 的插件在转换时均脱离全局 `Block_HTTPDNS` / `BlockAdvertisers` 基石插件，仅按需拆分对应依赖写入模块；其他来源插件保持原功能直转。**每个模块均可单独订阅启用**。

## 模块订阅列表

| 模块名称 | 说明 | Raw 订阅链接 |
| --- | --- | --- |
| **QQ音乐去广告** | 过滤 QQ 音乐广告；已按需拆入 `kelee.one` 基石中与 QQ 音乐/腾讯相关的广告统计及 DNSPod HTTPDNS 规则（无需 MITM） | `https://raw.githubusercontent.com/TO8E/surge/main/modules/QQMusic_remove_ads.sgmodule` |
| **酷安** | 过滤酷安热搜、帖子详情、评论区、信息流、首页及我的页面广告，外链 302 重定向（纯原生转换，需 Surge iOS 5.14.0+ / Mac 5.9.0+ 并开启 MITM） | `https://raw.githubusercontent.com/TO8E/surge/main/modules/CoolApk.sgmodule` |
| **京东** | 过滤京东广告及历史比价（默认开启获取慢慢买 Cookie 与详情嵌入表格图版；纯原生转换，不合入基石，需 Surge iOS 5.14.0+ / Mac 5.9.0+ 并开启 MITM） | `https://raw.githubusercontent.com/TO8E/surge/main/modules/JingDong.sgmodule` |
| **淘宝** | 过滤淘宝广告与 AMDC 下发请求（纯原生转换，不合入基石，需开启 MITM） | `https://raw.githubusercontent.com/TO8E/surge/main/modules/TaoBao.sgmodule` |
| **Google 重定向** | 将 `google.cn` / `g.cn` 通过 307 重定向至 `.com`（纯原生转换，不合入基石，需开启 MITM） | `https://raw.githubusercontent.com/TO8E/surge/main/modules/Google.sgmodule` |
| **高德地图** | 过滤高德地图开屏、首页、导航、搜索、打车与我的页面广告（纯原生转换，不合入基石，需 Surge iOS 5.14.0+ / Mac 5.9.0+ 并开启 MITM） | `https://raw.githubusercontent.com/TO8E/surge/main/modules/Amap.sgmodule` |
| **YouTube** | 移除 YouTube 广告并支持 Surge `#!arguments` 参数表配置后台播放/地区/隐藏 Shorts/字幕翻译（纯原生转换，不合入基石，需开启 MITM） | `https://raw.githubusercontent.com/TO8E/surge/main/modules/YouTube_CN.sgmodule` |
| **小红书** | 过滤小红书广告、去除图片/实况/视频水印（纯原生转换，不合入基石，需 Surge iOS 5.14.0+ / Mac 5.9.0+ 并开启 MITM） | `https://raw.githubusercontent.com/TO8E/surge/main/modules/RedNote.sgmodule` |
| **中国联通去广告** | 过滤中国联通开屏、搜索、浮窗及页面推广（纯原生无外部脚本，不合入基石，需 Surge iOS 5.14.0+ / Mac 5.9.0+ 并开启 MITM） | `https://raw.githubusercontent.com/TO8E/surge/main/modules/ChinaUnicom.sgmodule` |
| **一汽大众去广告** | 过滤一汽大众开屏、横幅、浮标与推荐流广告（纯原生无外部脚本，不合入基石，需 Surge iOS 5.14.0+ / Mac 5.9.0+ 并开启 MITM） | `https://raw.githubusercontent.com/TO8E/surge/main/modules/FAWVW_remove_ads.sgmodule` |

## 转换规范说明

- **独立解耦**：仅对 `kelee.one` 插件按需精准拆分其实际依赖的规则，剔除广义遥测、无关推送及跨应用通用规则，避免误杀；非 `kelee.one` 插件保持原功能直转。
- **元数据规范**：仅使用 Surge 官方支持的 `#!name`、`#!desc`、`#!requirement` 指令，移除 Loon 专有字段。
- **规则优化**：域名规则置于 IP 规则之前；对无 `DIRECT` 放行冲突的 `REJECT` 域名/IP 规则启用 `pre-matching`。
- **原生重写与脚本**：
  - Loon `reject_dict(200)` → Surge `[Map Local]` 内联文本 JSON 响应。
  - Loon `response.json.jq(...)` → Surge 原生 `[Body Rewrite]` `http-response-jq`（单引号包裹表达式，无需二次转义；并将 `(?i)` 置于 host 之后以保留 Surge 6.13+ 的 host 前缀优化）。
  - Loon `[Script]` → Surge 现代 `key = type=...,pattern=...,script-path=...,engine=jsc` 语法。
  - `[MITM]` 严格使用 `hostname = %APPEND% ...`。
- **官方校验**：所有模块均通过 Surge 官方校验服务（`https://services.nssurge.com/v1/config/validate`，Surge 6.12.0 解析器）单模块及合并校验。
