import { apiClient, type Post } from "@/features/shared/utils/api";

export async function createPost(
  title: string,
  content: string,
  published: boolean = false,
): Promise<{ newPost: Post }> {
  const response = await fetch(`${apiClient.baseUrl}/api/posts`, {
    method: "POST",
    credentials: "include",
    headers: apiClient.getHeaders(true),
    body: JSON.stringify({ title, content, published }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
