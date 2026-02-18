const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

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
  readonly baseUrl: string;
  private csrfToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadCsrfToken();
  }

  getCsrfToken(): string | null {
    return this.csrfToken;
  }

  /**
   * LocalStorageからCSRFトークンを読み込む
   */
  private loadCsrfToken() {
    if (typeof window !== "undefined") {
      this.csrfToken = localStorage.getItem("csrf-token");
    }
  }

  /**
   * CSRFトークンをLocalStorageに保存
   */
  private saveCsrfToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("csrf-token", token);
      this.csrfToken = token;
    }
  }

  /**
   * CSRFトークンを削除
   */
  private clearCsrfToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("csrf-token");
      this.csrfToken = null;
    }
  }

  /**
   * CSRF保護が必要なリクエスト用のヘッダーを取得
   */
  getHeaders(includeCSRF: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeCSRF && this.csrfToken) {
      headers["X-CSRF-Token"] = this.csrfToken;
    }

    return headers;
  }

  async signOut(): Promise<void> {
    await fetch(`${this.baseUrl}/api/auth/signout`, {
      method: "POST",
      credentials: "include",
      headers: this.getHeaders(true), // CSRF保護
    });

    // CSRFトークンを削除
    this.clearCsrfToken();
  }

  async signIn(data: { email: string; password: string }): Promise<{
    success: boolean;
    message: string;
    user: { id: string; email: string; name: string | null };
  }> {
    const response = await fetch(`${this.baseUrl}/api/auth/signin`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();

      // レート制限ブロックの場合、ブロックページにリダイレクト（エラーをthrowしない）
      if (errorData.code === "RATE_LIMIT_BLOCKED") {
        if (typeof window !== "undefined") {
          window.location.href = "/blocked";
        }
        // エラーをthrowせず、Promiseを保留状態にする（リダイレクトが完了するまで）
        return new Promise(() => {});
      }

      const error = new Error(
        errorData.error || `API Error: ${response.status}`,
      );
      // エラーコードを保持
      if (errorData.code) {
        // biome-ignore lint/suspicious/noExplicitAny: ランタイムエラーオブジェクトにコードを付与
        (error as any).code = errorData.code;
      }
      throw error;
    }

    const result = await response.json();

    // CSRFトークンを保存
    if (result.csrfToken) {
      this.saveCsrfToken(result.csrfToken);
    }

    return result;
  }

  async signUp(data: {
    email: string;
    password: string;
    passwordConfirmation: string;
  }): Promise<{
    success: boolean;
    message: string;
    user: { id: string; email: string; name: string | null };
  }> {
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

    const result = await response.json();

    // CSRFトークンを保存
    if (result.csrfToken) {
      this.saveCsrfToken(result.csrfToken);
    }

    return result;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

export async function getCurrentUser(): Promise<{ user: User } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/current_user`, {
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
