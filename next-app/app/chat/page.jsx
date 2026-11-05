import { ChatWorkspace } from '@/components/chat-workspace';
import { getChatProviderStatus } from '@/lib/ai-config';

export const metadata = { title: 'Career Coach · Streaming AI Chat' };
export const dynamic = 'force-dynamic';

export default function ChatPage() {
  const providerStatus = getChatProviderStatus();
  return <ChatWorkspace providerStatus={providerStatus} />;
}
