
import {
  consumeStream,
  convertToModelMessages,
  stepCountIs,
  streamText,
} from 'ai';

import {
  CHAT_LIMITS,
  getChatModel,
  getChatProviderStatus,
  SYSTEM_PROMPT,
} from '@/lib/ai-config';

import { validateChatMessages } from '@/lib/chat-validation.mjs';
import { jobMatchTool } from '@/lib/tools/job-match';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request) {
  // Check that the AI provider is configured.
  const { configured } = getChatProviderStatus();

  if (!configured) {
    return Response.json(
      {
        error: 'AI provider API key is not configured on the server.',
      },
      { status: 503 }
    );
  }

  // Reject requests that exceed the allowed size.
  const length = Number(
    request.headers.get('content-length') || 0
  );

  if (length > 150_000) {
    return Response.json(
      { error: 'Chat request is too large.' },
      { status: 413 }
    );
  }

  // Parse the incoming request body.
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: 'Request body must be valid JSON.' },
      { status: 400 }
    );
  }

  // Validate incoming chat messages.
  const result = validateChatMessages(body?.messages);

  if (!result.ok) {
    return Response.json(
      { error: result.error },
      { status: 400 }
    );
  }

  try {
    // Start the AI streaming response.
    const streamed = streamText({
      model: getChatModel(),

      system: `${SYSTEM_PROMPT}

You have access to the analyzeJobMatch tool.

Use it when the user provides both their skills and
a job's required skills and asks for a comparison.

Never invent skills or job requirements.

Use the tool's calculated score instead of guessing.

Explain that the score is based on exact skill matching,
not a prediction of hiring success.

If a tool fails, clearly acknowledge the failure.
Do not invent tool results or claim that the analysis succeeded.
Ask the user to retry the failed analysis.`,

      messages: await convertToModelMessages(result.messages),

      // FE-07: Server-side tool calling.
      tools: {
        analyzeJobMatch: jobMatchTool,
      },

      // Allow a follow-up generation after tool execution.
      stopWhen: stepCountIs(2),

      maxOutputTokens: CHAT_LIMITS.maxOutputTokens,
      temperature: CHAT_LIMITS.temperature,

      // Stop provider work if the request is aborted.
      abortSignal: request.signal,

      onError({ error }) {
        console.error('ApplyPilot chat provider error:', {
          name: error instanceof Error
            ? error.name
            : 'unknown',
          statusCode: error?.statusCode ?? 'unknown',
          isRetryable: error?.isRetryable ?? 'unknown',
        });
      },
    });

    // Return the response as an AI SDK UI message stream.
    return streamed.toUIMessageStreamResponse({
      consumeSseStream: consumeStream,

      onError() {
        return 'The AI provider could not finish this response. Please retry.';
      },
    });

  } catch (error) {
    console.error('Unable to start ApplyPilot AI chat:', {
      name: error instanceof Error ? error.name : 'unknown',
    });

    return Response.json(
      { error: 'Unable to start AI chat.' },
      { status: 500 }
    );
  }
}
