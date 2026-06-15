import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出：生成 out/，供 Cloudflare Pages 部署
  // 注：static export 不支持 next.config 的 headers()，
  // no-cache 等响应头改由 public/_headers 提供（Cloudflare Pages 读取）
  output: "export",
};

export default nextConfig;
