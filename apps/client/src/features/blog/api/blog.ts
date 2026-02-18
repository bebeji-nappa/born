import { apiClient, type Post } from "@/features/shared/utils/api";

export async function getAllPostsByUserId(
  userId: string,
  published?: 1 | 0,
  page: number = 1,
  limit: number = 10,
): Promise<{
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}> {
  const params = new URLSearchParams();
  if (published !== undefined) params.append("published", published.toString());
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const response = await fetch(
    `${apiClient.baseUrl}/api/posts/user/${userId}?${params.toString()}`,
    {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
