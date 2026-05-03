/**
 * Unit tests for rate-limit utility.
 * Uses mocked request objects since NextRequest requires Web API globals.
 */
import { rateLimit } from '@/utils/rate-limit';

// Create a mock NextRequest-like object
function createMockRequest(ip: string) {
  return {
    headers: {
      get: (name: string) => {
        if (name === 'x-forwarded-for') return ip;
        return null;
      },
    },
    ip: ip,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

describe('rateLimit', () => {
  it('allows requests within the limit', async () => {
    const req = createMockRequest('10.0.0.1');
    const result = await rateLimit(req, 5);
    expect(result.isRateLimited).toBe(false);
  });

  it('blocks requests exceeding the limit', async () => {
    const ip = '10.0.0.2';
    const req = createMockRequest(ip);
    
    // Exhaust the limit
    await rateLimit(req, 1);
    const result = await rateLimit(req, 1);
    
    expect(result.isRateLimited).toBe(true);
    expect(result.remaining).toBe(0);
  });
});
