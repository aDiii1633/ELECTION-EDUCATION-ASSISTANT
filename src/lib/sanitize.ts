/**
 * Input Sanitization & Validation Service
 * Defensive layer against XSS, injection, and malformed input.
 * Applied at all trust boundaries (user input, API responses).
 */
import { z } from 'zod';

// ── Sanitization ──────────────────────────────────────────────────────────────

/**
 * Strip HTML tags and dangerous characters from user input.
 * Prevents stored/reflected XSS when rendering user-provided content.
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')           // Strip HTML tags
    .replace(/javascript:/gi, '')      // Remove JS protocol
    .replace(/on\w+\s*=/gi, '')        // Remove inline event handlers
    .replace(/[<>"'`]/g, (char) => {   // Encode special chars
      const map: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#96;',
      };
      return map[char] ?? char;
    })
    .trim();
}

/**
 * Enforce a maximum input length to prevent abuse.
 */
export function enforceMaxLength(input: string, maxLength: number = 2000): string {
  return input.slice(0, maxLength);
}

/**
 * Sanitize and length-limit user chat input.
 */
export function sanitizeChatInput(raw: string): string {
  return enforceMaxLength(sanitizeInput(raw), 2000);
}

// ── Zod Schemas (Runtime Validation) ──────────────────────────────────────────

export const eligibilitySchema = z.object({
  age: z.number().int().min(1).max(120),
  citizenship: z.string().min(1).max(50),
  state: z.string().min(1).max(100),
  hasVoterId: z.boolean(),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  language: z.enum(['en', 'hi']),
  sessionId: z.string().min(1).max(100),
});

export const sessionTokenSchema = z.object({
  idToken: z.string().min(10).max(5000),
});

export type EligibilityInput = z.infer<typeof eligibilitySchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type SessionTokenInput = z.infer<typeof sessionTokenSchema>;
