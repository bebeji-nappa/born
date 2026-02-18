import { apiClient, type Post } from "@/features/shared/utils/api";

export async function updatePost(
  id: number,
  title: string,
  content: string,
  published: boolean,
): Promise<{ updatedPost: Post }> {
  const response = await fetch(`${apiClient.baseUrl}/api/posts/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: apiClient.getHeaders(true),
    body: JSON.stringify({ title, content, published }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
