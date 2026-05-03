/**
 * Centralized API Client
 * Single point of entry for all HTTP requests with:
 * - Automatic retries with exponential backoff
 * - Request timeout enforcement
 * - Centralized error handling
 * - Response validation
 */

const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

async function request<T>(url: string, config: RequestConfig = {}): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT_MS, retries = MAX_RETRIES, ...fetchConfig } = config;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchConfig.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const body = await response.text().catch(() => 'Unknown error');
        throw new ApiError(body, response.status, `HTTP_${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry client errors (4xx) or aborts
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        throw error;
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'TIMEOUT');
      }

      // Exponential backoff before retry
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 500));
      }
    }
  }

  throw lastError ?? new Error('Request failed after retries');
}

export const apiClient = {
  get: <T>(url: string, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'GET' }),

  post: <T>(url: string, body: unknown, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'POST', body: JSON.stringify(body) }),

  delete: <T>(url: string, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'DELETE' }),
};

export { ApiError };
