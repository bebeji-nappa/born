import { apiClient } from "@/features/shared/utils/api";

export async function forgotPassword(data: {
  email: string;
  redirect?: string;
}): Promise<{ success: boolean }> {
  const response = await fetch(
    `${apiClient.baseUrl}/api/auth/forgot-password`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }

  return response.json();
}
