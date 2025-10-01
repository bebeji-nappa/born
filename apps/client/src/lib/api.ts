const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
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

  async getAllPostsByUserId(userId: string, published?: 1 | 0): Promise<{ posts: Post[] }> {
    const response = await fetch(`${this.baseUrl}/api/posts/user/${userId}?published=${published}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async createPost(title: string, content: string, published: boolean = false): Promise<{ newPost: Post }> {
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
