import { consumeStream, convertToModelMessages, streamText } from 'ai';
import { CHAT_LIMITS, getChatModel, getChatProviderStatus, SYSTEM_PROMPT } from '@/lib/ai-config';
import { validateChatMessages } from '@/lib/chat-validation.mjs';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request) {
  const { configured } = getChatProviderStatus();
  if (!configured) {
    return Response.json({ error: 'AI provider API key is not configured on the server.' }, { status: 503 });
  }

  const length = Number(request.headers.get('content-length') || 0);
  if (length > 150_000) {
    return Response.json({ error: 'Chat request is too large.' }, { status: 413 });
  }

  let body;
  try { body = await request.json(); }
  catch { return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 }); }

  const result = validateChatMessages(body?.messages);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  try {
    const streamed = streamText({
      model: getChatModel(),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(result.messages),
      maxOutputTokens: CHAT_LIMITS.maxOutputTokens,
      temperature: CHAT_LIMITS.temperature,
      abortSignal: request.signal,
      onError({ error }) {
      console.error('ApplyPilot chat provider error:', {
      name: error instanceof Error ? error.name : 'unknown',
      statusCode: error?.statusCode ?? 'unknown',
      isRetryable: error?.isRetryable ?? 'unknown',
    });
  },
    });
    return streamed.toUIMessageStreamResponse({
      consumeSseStream: consumeStream,
      onError() { return 'The AI provider could not finish this response. Check your key, credits and model availability.'; },
    });
  } catch {
    return Response.json({ error: 'Unable to start AI chat.' }, { status: 500 });
  }
}
