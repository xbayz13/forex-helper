/**
 * API Client
 * Centralized API client dengan automatic token handling
 */

const API_BASE_URL = "/api";

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem("token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { skipAuth, ...fetchOptions } = options;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    };

    if (!skipAuth) {
      const token = this.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: "Request failed" } }));
      // Backend returns { error: { message: "...", code: "..." } }
      const errorMessage = errorData.error?.message || errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const api = new ApiClient();

