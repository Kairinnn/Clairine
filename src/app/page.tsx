import { getAllPosts, getAllCategories } from "@/lib/posts";
import HomeClient from "@/components/HomeClient";

export default function Home() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return <HomeClient posts={posts} categories={categories} />;
}
