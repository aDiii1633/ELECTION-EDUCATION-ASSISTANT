// lib/gemini.ts
// Gemini AI service — chat, eligibility checking, FAQ enhancement, and translation

import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';

// Cached model instance
let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

function getModel(): GenerativeModel {
  if (!model) {
    model = getGenAI().getGenerativeModel({ model: 'gemini-1.5-flash' });
  }
  return model;
}

// ── Election-specific system prompt ──────────────────────────────────────────
const ELECTION_SYSTEM_PROMPT = `You are an expert Election Process Education Assistant for India. 
You help citizens understand:
- How to vote and election procedures
- Voter eligibility criteria (age 18+, Indian citizen, not disqualified)
- Required documents (Aadhaar, PAN, Voter ID, Passport, driving license)
- Voter registration via Form 6 on voterportal.eci.gov.in
- Election Commission of India (ECI) guidelines
- Election dates, deadlines, and result announcements
- Polling booth procedures
- Electronic Voting Machines (EVMs) and VVPAT
- Model Code of Conduct
- Absentee voting for specific categories

Guidelines:
- Always be accurate, factual, and neutral
- Cite official sources (ECI, NVSP, Voter Helpline 1950)
- Never endorse any political party or candidate
- For sensitive queries, direct users to official ECI resources
- Respond in the user's preferred language if specified
- Keep responses concise but comprehensive

Respond ONLY about election/voting topics. For unrelated queries, politely redirect.`;

// ── Chat session cache ────────────────────────────────────────────────────────
const chatSessions = new Map<string, ChatSession>();

export function createChatSession(sessionId: string): ChatSession {
  if (chatSessions.has(sessionId)) {
    return chatSessions.get(sessionId)!;
  }
  const chat = getModel().startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: ELECTION_SYSTEM_PROMPT }],
      },
      {
        role: 'model',
        parts: [
          {
            text: 'I understand. I am the Election Process Education Assistant, ready to help Indian citizens navigate the electoral process. How can I assist you today?',
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.4,
    },
  });
  chatSessions.set(sessionId, chat);
  return chat;
}

// ── Send a chat message ───────────────────────────────────────────────────────
export async function sendChatMessage(
  sessionId: string,
  message: string,
  language: 'en' | 'hi' = 'en'
): Promise<string> {
  try {
    const chat = createChatSession(sessionId);
    const prompt =
      language === 'hi'
        ? `[RESPOND IN HINDI] ${message}`
        : message;

    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.warn('Gemini chat error:', error);
    return getFallbackResponse(message);
  }
}

// ── Eligibility checker ───────────────────────────────────────────────────────
export async function checkEligibility(data: {
  age: number;
  citizenship: string;
  state: string;
  hasVoterId: boolean;
}): Promise<{ eligible: boolean; reason: string; nextSteps: string[] }> {
  try {
    const prompt = `Analyze voter eligibility for India:
Age: ${data.age}
Citizenship: ${data.citizenship}
State: ${data.state}
Has Voter ID: ${data.hasVoterId}

Return a JSON object with:
- eligible: boolean
- reason: string (brief explanation)
- nextSteps: string[] (actionable steps, max 4)

Respond ONLY with valid JSON, no markdown.`;

    const result = await getModel().generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    // Fallback logic
    const eligible =
      data.age >= 18 &&
      data.citizenship.toLowerCase().includes('indian') &&
      !data.hasVoterId;

    return {
      eligible: data.age >= 18 && data.citizenship.toLowerCase().includes('indian'),
      reason:
        data.age < 18
          ? 'You must be at least 18 years old to vote in India.'
          : !data.citizenship.toLowerCase().includes('indian')
          ? 'Only Indian citizens can vote in Indian elections.'
          : data.hasVoterId
          ? 'You are already registered! Verify your details on voterportal.eci.gov.in'
          : 'You are eligible to register as a voter.',
      nextSteps: eligible
        ? [
            'Visit voterportal.eci.gov.in',
            'Fill Form 6 for new registration',
            'Upload required documents',
            'Track your application status',
          ]
        : ['Contact local election office for guidance', 'Visit eci.gov.in for more information'],
    };
  }
}

// ── FAQ answer enhancer ───────────────────────────────────────────────────────
export async function enhanceFAQAnswer(
  question: string,
  baseAnswer: string
): Promise<string> {
  try {
    const prompt = `Enhance this election FAQ answer to be more helpful and complete. Keep it under 150 words.

Question: ${question}
Base Answer: ${baseAnswer}

Provide an enhanced, clear answer. No markdown formatting, plain text only.`;

    const result = await getModel().generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return baseAnswer;
  }
}

// ── Document validation helper ────────────────────────────────────────────────
export async function validateDocuments(
  documentTypes: string[]
): Promise<{ valid: boolean; message: string; missing: string[] }> {
  try {
    const prompt = `For Indian voter registration, check if these documents are sufficient:
Documents: ${documentTypes.join(', ')}

Required: Proof of Identity (any one) + Proof of Address (any one) + Proof of Age (any one)

Valid documents: Aadhaar Card, PAN Card, Passport, Driving License, Voter ID, Birth Certificate, 10th Mark Sheet

Return JSON:
- valid: boolean
- message: string
- missing: string[] (missing document categories)

Respond ONLY with valid JSON.`;

    const result = await getModel().generateContent(prompt);
    const text = result.response.text().trim().replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(text);
  } catch {
    return {
      valid: documentTypes.length >= 2,
      message:
        documentTypes.length >= 2
          ? 'Your documents appear sufficient for registration.'
          : 'Please provide at least 2 identity documents.',
      missing: documentTypes.length < 2 ? ['Additional identity proof required'] : [],
    };
  }
}

// ── Graceful offline fallback ─────────────────────────────────────────────────
function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('register') || lower.includes('registration')) {
    return 'To register as a voter in India, visit voterportal.eci.gov.in and fill Form 6. You need proof of age, address, and identity.';
  }
  if (lower.includes('eligib')) {
    return 'You are eligible to vote if you are 18+ years old, an Indian citizen, and ordinarily resident of your constituency.';
  }
  if (lower.includes('document')) {
    return 'Accepted documents include: Aadhaar Card, PAN Card, Passport, Driving License, Bank Passbook, or any government-issued ID.';
  }
  if (lower.includes('booth') || lower.includes('polling')) {
    return 'Find your polling booth at electoralsearch.eci.gov.in using your Voter ID number or personal details.';
  }
  return 'For official election information, please visit eci.gov.in or call the Voter Helpline at 1950.';
}
