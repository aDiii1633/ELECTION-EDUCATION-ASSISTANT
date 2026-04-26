// __tests__/gemini.test.ts
/**
 * Unit tests for Gemini AI service utilities
 * Run with: npm test
 */

// Mock the Gemini SDK for testing without real API keys
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            eligible: true,
            reason: 'You meet all eligibility criteria.',
            nextSteps: ['Register at voterportal.eci.gov.in'],
          }),
        },
      }),
      startChat: jest.fn().mockReturnValue({
        sendMessage: jest.fn().mockResolvedValue({
          response: { text: () => 'You can register at voterportal.eci.gov.in' },
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
});
