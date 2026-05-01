// __tests__/gemini.test.ts
/**
 * Unit tests for Gemini AI service utilities
 * Run with: npm test
 */

// Mock the Gemini SDK for testing without real API keys
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockImplementation(async (req) => {
        const prompt = typeof req === 'string' ? req : req.contents[0].parts[0].text;
        if (prompt.includes('ERROR')) {
          throw new Error('Simulated API Error');
        }
        if (prompt.includes('sufficient')) {
          return {
            response: {
              text: () => JSON.stringify({
                valid: true,
                message: 'All good',
                missing: []
              })
            }
          };
        }
        if (prompt.includes('Enhance')) {
          return {
            response: {
              text: () => 'Enhanced answer'
            }
          };
        }
        return {
          response: {
            text: () => JSON.stringify({
              eligible: true,
              reason: 'You meet all eligibility criteria.',
              nextSteps: ['Register at voterportal.eci.gov.in'],
            }),
          },
        };
      }),
      startChat: jest.fn().mockReturnValue({
        sendMessage: jest.fn().mockImplementation(async (msg) => {
          if (msg.includes('ERROR')) throw new Error('Chat Error');
          return {
            response: { text: () => 'You can register at voterportal.eci.gov.in' },
          };
        }),
      }),
    }),
  })),
}));

describe('checkEligibility', () => {
  it('returns eligible for valid Indian citizen aged 18+', async () => {
    const { checkEligibility } = await import('../lib/gemini');
    const result = await checkEligibility({
      age: 25,
      citizenship: 'Indian',
      state: 'Delhi',
      hasVoterId: false,
    });
    expect(result).toHaveProperty('eligible');
    expect(result).toHaveProperty('reason');
    expect(result).toHaveProperty('nextSteps');
    expect(Array.isArray(result.nextSteps)).toBe(true);
  });

  it('returns required properties shape', async () => {
    const { checkEligibility } = await import('../lib/gemini');
    const result = await checkEligibility({
      age: 16,
      citizenship: 'Indian',
      state: 'Maharashtra',
      hasVoterId: false,
    });
    expect(typeof result.eligible).toBe('boolean');
    expect(typeof result.reason).toBe('string');
  });
});

describe('sendChatMessage', () => {
  it('reuses chat session', async () => {
    const { sendChatMessage } = await import('../lib/gemini');
    await sendChatMessage('test-session-reuse', 'Hello', 'en');
    const result = await sendChatMessage('test-session-reuse', 'Hello again', 'en');
    expect(result).toBeDefined();
  });

  it('returns a string response', async () => {
    const { sendChatMessage } = await import('../lib/gemini');
    const result = await sendChatMessage('test-session-id', 'How do I register to vote?', 'en');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('handles Hindi language parameter', async () => {
    const { sendChatMessage } = await import('../lib/gemini');
    const result = await sendChatMessage('test-session-hi', 'मतदान कैसे करें?', 'hi');
    expect(typeof result).toBe('string');
  });

  it('handles chat errors gracefully with fallback logic', async () => {
    const { sendChatMessage } = await import('../lib/gemini');
    const result1 = await sendChatMessage('test-session-err1', 'ERROR register', 'en');
    expect(result1).toContain('voterportal.eci.gov.in');

    const result2 = await sendChatMessage('test-session-err2', 'ERROR eligib', 'en');
    expect(result2).toContain('18+');

    const result3 = await sendChatMessage('test-session-err3', 'ERROR document', 'en');
    expect(result3).toContain('Aadhaar');

    const result4 = await sendChatMessage('test-session-err4', 'ERROR booth', 'en');
    expect(result4).toContain('electoralsearch.eci.gov.in');

    const result5 = await sendChatMessage('test-session-err5', 'ERROR something else', 'en');
    expect(result5).toContain('eci.gov.in');
  });
});

describe('validateDocuments', () => {
  it('returns validation result', async () => {
    const { validateDocuments } = await import('../lib/gemini');
    const result = await validateDocuments(['Aadhaar Card']);
    expect(result.valid).toBe(true);
    expect(result.message).toBe('All good');
    expect(result.missing).toEqual([]);
  });

  it('handles validation error fallback properly', async () => {
    const { validateDocuments } = await import('../lib/gemini');
    const result = await validateDocuments(['ERROR_DOC']);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('Please provide at least 2');
    expect(result.missing).toContain('Additional identity proof required');

    const result2 = await validateDocuments(['ERROR_DOC', 'ERROR_DOC2']);
    expect(result2.valid).toBe(true);
    expect(result2.message).toContain('sufficient');
  });
});

describe('enhanceFAQAnswer', () => {
  it('returns enhanced text', async () => {
    const { enhanceFAQAnswer } = await import('../lib/gemini');
    const result = await enhanceFAQAnswer('enhance question', 'original answer');
    expect(result).toBe('Enhanced answer');
  });

  it('handles enhance error', async () => {
    const { enhanceFAQAnswer } = await import('../lib/gemini');
    const result = await enhanceFAQAnswer('ERROR', 'original answer');
    expect(result).toBe('original answer');
  });
});

describe('checkEligibility Fallbacks', () => {
  it('handles under 18', async () => {
    const { checkEligibility } = await import('../lib/gemini');
    const result = await checkEligibility({ age: 16, citizenship: 'ERROR', state: 'Delhi', hasVoterId: false });
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('18 years old');
  });

  it('handles non-Indian', async () => {
    const { checkEligibility } = await import('../lib/gemini');
    const result = await checkEligibility({ age: 25, citizenship: 'US ERROR', state: 'Delhi', hasVoterId: false });
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('Only Indian citizens');
  });

  it('handles already registered', async () => {
    const { checkEligibility } = await import('../lib/gemini');
    const result = await checkEligibility({ age: 25, citizenship: 'Indian ERROR', state: 'Delhi', hasVoterId: true });
    expect(result.eligible).toBe(true);
    expect(result.reason).toContain('already registered');
  });

  it('handles full eligibility', async () => {
    const { checkEligibility } = await import('../lib/gemini');
    const result = await checkEligibility({ age: 25, citizenship: 'Indian ERROR', state: 'Delhi', hasVoterId: false });
    expect(result.eligible).toBe(true);
    expect(result.reason).toContain('eligible to register');
    expect(result.nextSteps[0]).toContain('voterportal');
  });

  it('handles checkEligibility error', async () => {
    const { checkEligibility } = await import('../lib/gemini');
    const result = await checkEligibility({
      age: 25,
      citizenship: 'ERROR',
      state: 'Delhi',
      hasVoterId: false,
    });
    expect(result.eligible).toBe(false);
  });
});
