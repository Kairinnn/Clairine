import { NextResponse } from "next/server";
import { getAllPosts, getAllCategories } from "@/lib/posts";

// 静态导出（output: "export"）模式下必须声明，否则构建报错
export const dynamic = "force-static";
export async function GET() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  return NextResponse.json({ posts, categories });
}
