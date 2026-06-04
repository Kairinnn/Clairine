import { NextResponse } from "next/server";
import { getAllPosts, getAllCategories } from "@/lib/posts";

export async function GET() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  return NextResponse.json({ posts, categories });
}
