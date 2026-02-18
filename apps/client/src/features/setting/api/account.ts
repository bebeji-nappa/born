import { apiClient, type User } from "@/features/shared/utils/api";

export async function updateUserScreenName(
  screen_name: string,
): Promise<{ success: boolean; user: User }> {
  const response = await fetch(`${apiClient.baseUrl}/api/users/screen-name`, {
    method: "PUT",
    credentials: "include",
    headers: apiClient.getHeaders(true),
    body: JSON.stringify({ screen_name }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getPendingEmailChange(): Promise<{
  pending: boolean;
  newEmail?: string;
  expiresAt?: string;
}> {
  const response = await fetch(`${apiClient.baseUrl}/api/users/email/pending`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export async function requestEmailChange(
  newEmail: string,
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${apiClient.baseUrl}/api/users/email/request`, {
    method: "POST",
    credentials: "include",
    headers: apiClient.getHeaders(true),
    body: JSON.stringify({ newEmail }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }

  return response.json();
}
