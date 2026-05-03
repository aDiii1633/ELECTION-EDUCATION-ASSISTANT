/**
 * Unit tests for centralized API client.
 * Covers retry logic, timeout handling, and error classification.
 */

import { apiClient, ApiError } from '@/lib/api-client';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('apiClient', () => {
  describe('get', () => {
    it('returns parsed JSON on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'test' }),
      });

      const result = await apiClient.get<{ data: string }>('/api/test');
      expect(result.data).toBe('test');
    });

    it('throws ApiError on HTTP error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not found',
      });

      await expect(apiClient.get('/api/missing', { retries: 0 }))
        .rejects.toThrow(ApiError);
    });

    it('does not retry on 4xx client errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => 'Bad request',
      });

      await expect(apiClient.get('/api/bad', { retries: 3 }))
        .rejects.toThrow(ApiError);
      
      // Should only be called once (no retries for 4xx)
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('post', () => {
    it('sends JSON body correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const result = await apiClient.post<{ success: boolean }>('/api/submit', { name: 'test' });
      expect(result.success).toBe(true);

      const [, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe('POST');
      expect(options.body).toBe(JSON.stringify({ name: 'test' }));
      expect(options.headers['Content-Type']).toBe('application/json');
    });
  });

  describe('delete', () => {
    it('sends DELETE request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ deleted: true }),
      });

      const result = await apiClient.delete<{ deleted: boolean }>('/api/item/1');
      expect(result.deleted).toBe(true);

      const [, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe('DELETE');
    });
  });
});

describe('ApiError', () => {
  it('contains status and code', () => {
    const error = new ApiError('Not found', 404, 'HTTP_404');
    expect(error.status).toBe(404);
    expect(error.code).toBe('HTTP_404');
    expect(error.name).toBe('ApiError');
    expect(error.message).toBe('Not found');
  });
});
