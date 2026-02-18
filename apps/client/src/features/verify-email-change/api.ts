import { apiClient } from "@/lib/api";

export async function verifyEmailChange(
  token: string,
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(
    `${apiClient.baseUrl}/api/users/email/verify?token=${encodeURIComponent(token)}`,
    {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }

  return response.json();
}
