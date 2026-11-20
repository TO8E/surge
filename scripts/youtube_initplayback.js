// Surge 专用：仅拦截 YouTube iOS 客户端的 initplayback POST 请求，替代 Loon 的 reject_video(200)
const ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";

if ($request.method === "POST" && /(?:^|\s)com\.google\.ios\.youtube\//i.test(ua)) {
  $done({
    response: {
      status: 200,
      headers: {
        "Content-Type": "video/mp4"
      },
      body: ""
    }
  });
} else {
  $done({});
}
