// Only a bounded, text-only conversation is allowed in this FE-06 route.
// FE-07 can deliberately add validated tool parts instead of trusting arbitrary client JSON.
export const MAX_CHAT_MESSAGES = 24;
export const MAX_MESSAGE_CHARACTERS = 2500;
export const MAX_CONVERSATION_CHARACTERS = 18000;

export function validateChatMessages(input) {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_CHAT_MESSAGES) {
    return { ok: false, error: 'Conversation must contain between 1 and 24 messages.' };
  }

  let total = 0;
  const messages = [];
  for (const [index, item] of input.entries()) {
    if (!item || (item.role !== 'user' && item.role !== 'assistant') || !Array.isArray(item.parts)) {
      return { ok: false, error: 'Unsupported message format.' };
    }
    // The UI SDK sends UIMessage.parts. Strip untrusted tool, reasoning and file parts.
    const text = item.parts.filter(part => part && part.type === 'text' && typeof part.text === 'string')
      .map(part => part.text).join('').trim();
    if (!text || text.length > MAX_MESSAGE_CHARACTERS) {
      return { ok: false, error: 'Each message must contain 1–2500 text characters.' };
    }
    total += text.length;
    if (total > MAX_CONVERSATION_CHARACTERS) {
      return { ok: false, error: 'Conversation is too long. Start a new chat.' };
    }
    messages.push({
      id: typeof item.id === 'string' && item.id.length < 128 ? item.id : `message-${index}`,
      role: item.role,
      parts: [{ type: 'text', text }],
    });
  }
  if (messages.at(-1).role !== 'user') {
    return { ok: false, error: 'The newest message must be from the user.' };
  }
  return { ok: true, messages };
}
