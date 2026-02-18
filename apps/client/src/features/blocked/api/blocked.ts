import { apiClient } from "@/features/shared/utils/api";

export async function getRateLimitStatus(): Promise<{
  blocked: boolean;
  retryAfter: number;
}> {
  const response = await fetch(
    `${apiClient.baseUrl}/api/auth/rate-limit-status`,
    {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
