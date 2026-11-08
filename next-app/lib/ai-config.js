import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';

// FE-06 central configuration. Do not put model secrets in NEXT_PUBLIC_*.
// Set AI_PROVIDER=google (default) with GOOGLE_GENERATIVE_AI_API_KEY,
// or AI_PROVIDER=anthropic with ANTHROPIC_API_KEY.
const CHAT_PROVIDER = process.env.AI_PROVIDER === 'anthropic' ? 'anthropic' : 'google';
const CHAT_MODEL = CHAT_PROVIDER === 'anthropic'
  ? (process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5')
  : (process.env.GOOGLE_MODEL || 'gemini-2.5-flash');

export const SYSTEM_PROMPT = `You are ApplyPilot AI, a practical career-preparation coach for students and early-career developers.
Help users clarify job preferences, write effective bullet points, prepare for interviews, and plan their job search. Ask one concise clarifying question if necessary; give concrete examples when useful.
Never claim you have searched current job listings, verified job availability, reviewed a resume file, or submitted an application: these integrations are NOT implemented.
Do not invent company vacancies, guaranteed outcomes, salaries, or personal qualifications. Explain uncertainty and encourage users to verify opportunities on official sites.
Protect privacy: do not request passwords, government IDs, or highly sensitive personal information. Keep responses clear, supportive and concise.`;

export const CHAT_LIMITS = {
  maxOutputTokens: 700,
  temperature: 0.4,
  maxDurationSeconds: 60,
};

export function getChatProviderStatus() {
  return {
    provider: CHAT_PROVIDER,
    model: CHAT_MODEL,
    configured: CHAT_PROVIDER === 'anthropic'
      ? Boolean(process.env.ANTHROPIC_API_KEY?.trim())
      : Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()),
  };
}

export function getChatModel() {
  return CHAT_PROVIDER === 'anthropic' ? anthropic(CHAT_MODEL) : google(CHAT_MODEL);
}
