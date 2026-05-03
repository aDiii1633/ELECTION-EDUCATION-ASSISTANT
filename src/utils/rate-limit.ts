import { NextRequest } from 'next/server';
import { LRUCache } from 'lru-cache';

const tokenCache = new LRUCache<string, number[]>({
  max: 500,
  ttl: 60 * 1000, // 1 minute
});

export async function rateLimit(request: NextRequest, limit: number = 10) {
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1';
  const tokenCount = tokenCache.get(ip) || [0];
  
  if (tokenCount[0] === 0) {
    tokenCache.set(ip, [1]);
  } else {
    tokenCount[0] += 1;
    tokenCache.set(ip, tokenCount);
  }

  const currentUsage = tokenCount[0];
  const isRateLimited = currentUsage > limit;

  return {
    isRateLimited,
    currentUsage,
    limit,
    remaining: isRateLimited ? 0 : limit - currentUsage,
  };
}
