const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Helper function to normalize date fields
function normalizeDate(value: any): string {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'number') return new Date(value).toISOString();
  return new Date(value).toISOString();
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  screen_name: string | null;
  image?: string;
  description?: string | null;
  github_id?: string | null;
  createdAt: string | Date | number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  userId: string;
  createdAt: string | Date | number;
  updatedAt: string | Date | number;
  user: User;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Auth APIs
  async getCurrentUser(): Promise<{ user: User } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/current_user`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });


      if (!response.ok) {
        return null;
      }

      return response.json();
    } catch {
      return null;
    }
  }

  async signOut(): Promise<void> {
    await fetch(`${this.baseUrl}/api/auth/signout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
  }

  async signIn(data: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; message: string; user: { id: string; email: string; name: string | null } }> {
    const response = await fetch(`${this.baseUrl}/api/auth/signin`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error: any = new Error(errorData.error || `API Error: ${response.status}`);
      // エラーコードを保持
      if (errorData.code) {
        error.code = errorData.code;
      }
      throw error;
    }

    return response.json();
  }

  async signUp(data: {
    email: string;
    password: string;
    passwordConfirmation: string;
  }): Promise<{ success: boolean; message: string; user: { id: string; email: string; name: string | null } }> {
    const response = await fetch(`${this.baseUrl}/api/auth/signup`, {
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

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    return response.json();
  }

  // User APIs
  async getAllUsers(): Promise<{ users: User[] }> {
    const response = await fetch(`${this.baseUrl}/api/users`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUserByEmail(email: string): Promise<{ user: User | null }> {
    const url = new URL("/api/users/by-email", this.baseUrl);

    const response = await fetch(`${url}?email=${encodeURIComponent(email)}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUserById(id: string): Promise<{ user: User | null }> {
    const response = await fetch(`${this.baseUrl}/api/users/${id}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getAuthUserId(email: string): Promise<{ userId: string }> {
    const url = new URL("/api/users/auth-id", this.baseUrl);

    const response = await fetch(`${url}?email=${encodeURIComponent(email)}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async updateUserProfile(data: {
    name?: string;
    description?: string | null;
  }): Promise<{ success: boolean; user: User }> {
    const response = await fetch(`${this.baseUrl}/api/users/profile`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async updateUserAvatar(file: File): Promise<{ success: boolean; url: string; user: User }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${this.baseUrl}/api/users/avatar/image`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async updateUserScreenName(screen_name: string): Promise<{ success: boolean; user: User }> {
    const response = await fetch(`${this.baseUrl}/api/users/screen-name`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ screen_name }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async updatePassword(data: {
    password: string;
    passwordConfirmation: string;
  }): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/api/users/password`, {
      method: "PUT",
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

  // Post APIs
  async getPostById(id: number): Promise<{ post: Post }> {
    const response = await fetch(`${this.baseUrl}/api/posts/${id}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getAllPostsByUserId(
    userId: string,
    published?: 1 | 0,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ posts: Post[]; pagination: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean } }> {
    const params = new URLSearchParams();
    if (published !== undefined) params.append('published', published.toString());
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await fetch(
      `${this.baseUrl}/api/posts/user/${userId}?${params.toString()}`,
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

  async createPost(
    title: string,
    content: string,
    published: boolean = false,
  ): Promise<{ newPost: Post }> {
    const response = await fetch(`${this.baseUrl}/api/posts`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, published }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async updatePost(
    id: number,
    title: string,
    content: string,
    published: boolean,
  ): Promise<{ updatedPost: Post }> {
    const body: any = { title, content, published };

    const response = await fetch(`${this.baseUrl}/api/posts/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async deletePost(id: number): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/api/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

