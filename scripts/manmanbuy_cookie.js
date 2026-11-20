// Surge 专用：捕获慢慢买 Cookie 并立即 $done({})，避免上游脚本缺少 $done 或调用 $log 导致请求超时
const body = $request.body || "";

if (body) {
  $persistentStore.write(body, "manmanbuy_val");
  const match = body.match(/(?:^|&)c_mmbDevId=([^&]*)/);
  if (match) {
    $persistentStore.write(decodeURIComponent(match[1]), "慢慢买CK");
  }
  $notification.post("京东比价", "获取ck成功🎉", body);
}

$done({});
