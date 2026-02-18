import { apiClient, type User } from "@/lib/api";

export async function updateUserProfile(data: {
  name?: string;
  description?: string | null;
}): Promise<{ success: boolean; user: User }> {
  const response = await fetch(`${apiClient.baseUrl}/api/users/profile`, {
    method: "PUT",
    credentials: "include",
    headers: apiClient.getHeaders(true),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function updateUserAvatar(
  file: File,
): Promise<{ success: boolean; url: string; user: User }> {
  const formData = new FormData();
  formData.append("file", file);

  const headers: HeadersInit = {};
  const csrfToken = apiClient.getCsrfToken();
  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }

  const response = await fetch(`${apiClient.baseUrl}/api/users/avatar/image`, {
    method: "PUT",
    credentials: "include",
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
