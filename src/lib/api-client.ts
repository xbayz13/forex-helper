/**
 * API Client
 * Centralized API client for making HTTP requests to the backend
 */

const API_BASE_URL = "/api";

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

export class ApiClientError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * API Client class for making HTTP requests
 */
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get authentication token from localStorage
   */
  private getToken(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * Build full URL
   */
  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith("http")) {
      return endpoint;
    }
    return `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  }

  /**
   * Build headers with authentication if needed
   */
  private buildHeaders(options: RequestOptions): HeadersInit {
    const headers = new Headers(options.headers);

    if (!headers.has("Content-Type") && options.body) {
      headers.set("Content-Type", "application/json");
    }

    if (options.requireAuth !== false) {
      const token = this.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return headers;
  }

  /**
   * Handle response and parse JSON
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      let error: ApiError;
      if (isJson) {
        error = await response.json();
      } else {
        error = {
          error: response.statusText,
          statusCode: response.status,
        };
      }
      // Backend returns { error: { message: "...", code: "..." } }
      // Extract message from nested error object if it exists
      const errorMessage = 
        (error as any)?.error?.message || 
        error.message || 
        (error as any)?.error || 
        error.error || 
        "Request failed";
      throw new ApiClientError(
        errorMessage,
        error.statusCode || response.status,
        error
      );
    }

    if (isJson) {
      return await response.json();
    }

    return (await response.text()) as T;
  }

  /**
   * Make a request
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }
      throw new ApiClientError(
        error instanceof Error ? error.message : "Network error",
        undefined,
        error
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export convenience functions
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiClient.get<T>(endpoint, options),
  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiClient.post<T>(endpoint, data, options),
  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiClient.put<T>(endpoint, data, options),
  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiClient.patch<T>(endpoint, data, options),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiClient.delete<T>(endpoint, options),
};

