import { apiClient } from "@/utils/api";

export async function resetPassword(data: {
  token: string;
  password: string;
  passwordConfirmation: string;
  logoutOtherDevices: boolean;
}): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${apiClient.baseUrl}/api/auth/reset-password`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }

  return response.json();
}
