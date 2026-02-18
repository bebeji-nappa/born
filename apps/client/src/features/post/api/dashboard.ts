import { apiClient } from "@/features/shared/utils/api";

export async function deletePost(id: number): Promise<{ message: string }> {
  const response = await fetch(`${apiClient.baseUrl}/api/posts/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: apiClient.getHeaders(true),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
