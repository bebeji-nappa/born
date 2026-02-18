import { apiClient, type Post } from "@/utils/api";

export async function getPostById(id: number): Promise<{ post: Post }> {
  const response = await fetch(`${apiClient.baseUrl}/api/posts/${id}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
