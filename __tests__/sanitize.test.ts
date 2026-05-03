/**
 * Unit tests for input sanitization — the security boundary layer.
 * Covers XSS prevention, length enforcement, and Zod validation.
 */

import {
  sanitizeInput,
  enforceMaxLength,
  sanitizeChatInput,
  eligibilitySchema,
  chatMessageSchema,
  sessionTokenSchema,
} from '@/lib/sanitize';

describe('sanitizeInput', () => {
  it('strips HTML tags', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).not.toContain('<script>');
    expect(sanitizeInput('<img src=x onerror=alert(1)>')).not.toContain('<img');
  });

  it('removes javascript: protocol', () => {
    expect(sanitizeInput('javascript:alert(1)')).not.toContain('javascript:');
  });

  it('removes inline event handlers', () => {
    expect(sanitizeInput('onload=alert(1)')).not.toContain('onload=');
    expect(sanitizeInput('onclick=steal()')).not.toContain('onclick=');
  });

  it('encodes special characters in non-tag contexts', () => {
    const result = sanitizeInput('Hello "test" world');
    expect(result).not.toContain('"');
    expect(result).toContain('&quot;');
  });

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('passes through safe content unchanged', () => {
    const safe = 'How do I register to vote in Delhi?';
    expect(sanitizeInput(safe)).toBe(safe);
  });
});

describe('enforceMaxLength', () => {
  it('truncates long strings', () => {
    const long = 'a'.repeat(3000);
    expect(enforceMaxLength(long, 2000)).toHaveLength(2000);
  });

  it('preserves short strings', () => {
    expect(enforceMaxLength('short', 2000)).toBe('short');
  });
});

describe('sanitizeChatInput', () => {
  it('applies both sanitization and length limits', () => {
    const malicious = '<script>alert("xss")</script>' + 'a'.repeat(3000);
    const result = sanitizeChatInput(malicious);
    expect(result).not.toContain('<script>');
    expect(result.length).toBeLessThanOrEqual(2000);
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeChatInput('')).toBe('');
    expect(sanitizeChatInput('   ')).toBe('');
  });
});

describe('Zod schemas', () => {
  describe('eligibilitySchema', () => {
    it('accepts valid input', () => {
      const result = eligibilitySchema.safeParse({
        age: 25,
        citizenship: 'Indian',
        state: 'Delhi',
        hasVoterId: false,
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid age', () => {
      expect(eligibilitySchema.safeParse({ age: 0, citizenship: 'Indian', state: 'Delhi', hasVoterId: false }).success).toBe(false);
      expect(eligibilitySchema.safeParse({ age: 121, citizenship: 'Indian', state: 'Delhi', hasVoterId: false }).success).toBe(false);
      expect(eligibilitySchema.safeParse({ age: 'abc', citizenship: 'Indian', state: 'Delhi', hasVoterId: false }).success).toBe(false);
    });

    it('rejects missing fields', () => {
      expect(eligibilitySchema.safeParse({ age: 25 }).success).toBe(false);
    });
  });

  describe('chatMessageSchema', () => {
    it('accepts valid message', () => {
      const result = chatMessageSchema.safeParse({
        message: 'How to vote?',
        language: 'en',
        sessionId: 'sess-123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty message', () => {
      expect(chatMessageSchema.safeParse({ message: '', language: 'en', sessionId: 'x' }).success).toBe(false);
    });

    it('rejects invalid language', () => {
      expect(chatMessageSchema.safeParse({ message: 'hello', language: 'fr', sessionId: 'x' }).success).toBe(false);
    });
  });

  describe('sessionTokenSchema', () => {
    it('accepts valid token', () => {
      const result = sessionTokenSchema.safeParse({ idToken: 'a'.repeat(100) });
      expect(result.success).toBe(true);
    });

    it('rejects too-short token', () => {
      expect(sessionTokenSchema.safeParse({ idToken: 'short' }).success).toBe(false);
    });
  });
});
