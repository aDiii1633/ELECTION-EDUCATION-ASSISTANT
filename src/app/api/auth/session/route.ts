import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { rateLimit } from '@/utils/rate-limit';
import { sessionTokenSchema } from '@/lib/sanitize';
import { logger } from '@/utils/logger';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/session
 * Creates a Firebase session cookie from an ID token.
 * Security: rate-limited, validated, httpOnly, secure, sameSite.
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 attempts per minute per IP
    const { isRateLimited } = await rateLimit(req, 5);
    if (isRateLimited) {
      logger.warn('Rate limit exceeded for session creation');
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Validate content type
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 415 }
      );
    }

    // Parse and validate body with Zod
    const body = await req.json();
    const parsed = sessionTokenSchema.safeParse(body);
    if (!parsed.success) {
      logger.warn('Invalid session token format', parsed.error.flatten());
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { idToken } = parsed.data;

    // Dynamic import to avoid SSR bundling issues
    const { getAdminAuth } = await import('@/services/firebase-admin');
    const adminAuth = getAdminAuth();

    // 5-day session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const cookieStore = await cookies();
    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn / 1000, // maxAge expects seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Session creation failed', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

/**
 * DELETE /api/auth/session
 * Clears the session cookie.
 */
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Session deletion failed', error);
    return NextResponse.json(
      { error: 'Failed to clear session' },
      { status: 500 }
    );
  }
}
