// 彩云天气Pro — 去广告 + SVIP 解锁（Surge / Loon 通用，jsc 引擎）
//
// 来源：RuCu6/Loon Scripts/caiyun.js (2024-09-28)
//       ishowshu/qx script/caiyun.js (2026-11-12，把响应体改写分支删空，仅剩 token 注入)
//       本文件在 RuCu6 原版基础上做加固，托管于 TO8E/surge/scripts/caiyun.js
//
// 解锁原理：会员状态以服务端返回的 vip_info / user_detail / v2/user 字段为准，
//           本脚本把这三个接口的响应改写成永久 SVIP（不依赖任何会员 token）。
// 加固点：
//   1. header.version 缺失时 compareVersions 不再抛 TypeError（原脚本会整段静默失败）
//   2. 响应不是 JSON 时直接放行，不动二进制内容
//   3. 写 header 时复用原有大小写，避免产生重复 header

const url = $request.url;

// 作者账号的会员 token（2026 年已判 Expired，仅保留以兼容仍需该头的接口）
const CY_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJ1c2VyX2lkIjoiNWY1YmZjNTdkMmM2ODkwMDE0ZTI2YmI4Iiwic3ZpcF9leHBpcmVkX2F0IjoxNzA1MzMxMTY2LjQxNjc3MSwidmlwX2V4cGlyZWRfYXQiOjB9.h_Cem89QarTXxVX9Z_Wt-Mak6ZHAjAJqgv3hEY6wpps";

function setHeader(headers, name, value) {
  let key = name;
  for (const k of Object.keys(headers)) {
    if (k.toLowerCase() === name.toLowerCase()) {
      key = k;
      delete headers[k];
    }
  }
  headers[key] = value;
}

function compareVersions(t, r) {
  const a = String(t || "0").split(".").map(Number);
  const b = String(r || "0").split(".").map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}

if (typeof $response === "undefined") {
  // —— 请求阶段：卫星云图 / 原图请求带上会员凭证 ——
  const header = $request.headers;
  setHeader(header, "device-token", CY_TOKEN);
  if (compareVersions(header.version, "7.19.0") > 0) {
    setHeader(header, "Authorization", "Bearer " + CY_TOKEN);
  }
  console.log(`[caiyun] token inject → ${url.split("?")[0]}`);
  $done({ headers: header });
} else {
  // —— 响应阶段：广告清洗 + 会员字段改写 ——
  let obj;
  try {
    obj = JSON.parse($response.body);
  } catch (e) {
    obj = undefined;
  }

  if (obj === undefined) {
    // 非 JSON（二进制图片等）原样放行
    $done({});
  } else {
    if (url.includes("/api.caiyunapp.com/v1/activity")) {
      if (url.includes("&type_id=A03&")) {
        // 底栏控制项目 主页图标 天气助手 彩云ai
        if (obj?.interval) {
          obj.interval = 2592000; // 30天
        }
        if (obj?.activities?.length > 0) {
          for (const item of obj.activities) {
            if (item?.name && item?.type && item?.feature) {
              item.feature = false;
            }
          }
        }
      } else {
        obj = { status: "ok", activities: [{ items: [] }] };
      }
    } else if (url.includes("/api/v1/user_detail")) {
      // 我的页面（新版）
      if (obj?.vip_info?.show_upcoming_renewal) {
        obj.vip_info.show_upcoming_renewal = false;
      }
      if (obj?.vip_info?.svip) {
        obj.vip_info.svip.is_auto_renewal = true;
        obj.vip_info.svip.expires_time = "3742732800";
      }
    } else if (url.includes("/wrapper.cyapi.cn/v1/activity")) {
      // 彩云推广
      if (["&type_id=A03&"].includes(url)) {
        if (obj?.interval) {
          obj.interval = 2592000;
        }
        if (obj?.activities?.length > 0) {
          obj.activities = [];
        }
      } else {
        obj = { status: "ok", activities: [{ items: [] }] };
      }
    } else if (url.includes("/v1/vip_info")) {
      // 我的页面
      if (obj?.vip) {
        obj.vip.expires_time = "4030000000";
      }
      if (obj?.svip) {
        obj.svip.expires_time = "4030000000";
      }
      if (obj?.show_upcoming_renewal) {
        obj.show_upcoming_renewal = false;
      }
    } else if (url.includes("/v2/user")) {
      // 我的页面（v2/user）
      if (obj?.result) {
        obj.result.svip_given = 730;
        obj.result.is_phone_verified = true;
        obj.result.is_xy_vip = true;
        obj.result.vip_expired_at = 4030000000.16;
        obj.result.is_vip = true;
        obj.result.xy_svip_expire = 4030000000.16;
        if (obj?.result?.wt) {
          if (obj.result.wt.vip) {
            obj.result.wt.vip.enabled = true;
            obj.result.wt.vip.expired_at = 4030000000.16;
            obj.result.wt.vip.svip_expired_at = 4030000000.16;
          }
          obj.result.wt.svip_given = 730;
        }
        obj.result.is_primary = true;
        obj.result.xy_vip_expire = 4030000000.16;
        obj.result.svip_expired_at = 4030000000.16;
        obj.result.vip_type = "s";
      }
    }

    $done({ body: JSON.stringify(obj) });
  }
}
