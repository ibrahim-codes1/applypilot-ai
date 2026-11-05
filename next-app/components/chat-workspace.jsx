'use client';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isNearBottom } from '@/lib/chat-scroll.mjs';

const chatTransport = new DefaultChatTransport({ api: '/api/chat' });
const STORAGE_KEY = 'applypilot-fe06-chat-v1';
const suggestions = [
  'Help me prepare for a junior frontend interview.',
  'How can I improve a Flutter project bullet point on my resume?',
  'Create a two-week internship application plan.',
];

function messageText(message) {
  return (message.parts || []).filter(part => part.type === 'text').map(part => part.text).join('');
}

function ChatBubble({ message, isStreaming }) {
  const mine = message.role === 'user';
  const text = messageText(message);
  return <article className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
    <div className={`min-w-0 max-w-[90%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[82%] ${mine ? 'rounded-br-md bg-indigo-600 text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'}`}>
      <p className={`mb-1.5 text-[11px] font-bold uppercase tracking-wide ${mine ? 'text-indigo-100' : 'text-indigo-600'}`}>{mine ? 'You' : 'ApplyPilot AI'}</p>
    <div className="min-w-0 break-words text-sm leading-7 [&_h1]:text-xl [&_h2]:text-lg [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-semibold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-100 [&_pre]:p-3 [&_code]:break-words">
    {mine ? (
      <p className="whitespace-pre-wrap">{text}</p>
    ) : (
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {text}
      </ReactMarkdown>
    )}
    </div>

      {!mine && isStreaming && <span aria-hidden="true" className="ml-1 inline-block h-3 w-1 animate-pulse rounded bg-indigo-500 align-middle" />}
    </div>
  </article>;
}

function ThinkingBubble() {
  return <div className="flex justify-start"><div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-5 py-4 shadow-sm" role="status" aria-label="AI is thinking">
    <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-indigo-600">ApplyPilot AI</p>
    <span className="flex items-center gap-1.5 text-sm text-slate-500">Thinking
      {[0, 1, 2].map(n => <span key={n} className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" style={{ animationDelay: `${n * 140}ms` }} />)}
    </span>
  </div></div>;
}

export function ChatWorkspace({ providerStatus }) {
  const [input, setInput] = useState('');
  const [notice, setNotice] = useState('');
  const [jumpVisible, setJumpVisible] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef(null);
  const stickToBottomRef = useRef(true);
  const textareaRef = useRef(null);

  const { messages, setMessages, sendMessage, status, stop, error } = useChat({
    transport: chatTransport,
    onError() { setNotice('Request failed. Check the AI key, provider credits, or network and try again.'); },
  });
  const busy = status === 'submitted' || status === 'streaming';
  const lastMessage = messages.at(-1);
  const waitingForFirstToken = busy && (lastMessage?.role !== 'assistant' || !messageText(lastMessage));

  // Optional browser-local persistence. Never store the model's API key in the browser.
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved)) {
        const valid = saved.filter(m => m && (m.role === 'assistant' || m.role === 'user') && Array.isArray(m.parts));
        if (valid.length) setMessages(valid.slice(-24));
      }
    } catch { /* bad or disabled storage: keep an empty conversation */ }
    setHydrated(true);
  }, [setMessages]);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-24))); }
    catch { /* storage may be unavailable in private mode */ }
  }, [hydrated, messages]);

  useEffect(() => {
    const area = scrollRef.current;
    if (!area || !stickToBottomRef.current) return;
    area.scrollTop = area.scrollHeight;
  }, [messages, waitingForFirstToken]);

  const onScroll = useCallback(() => {
    const area = scrollRef.current;
    if (!area) return;
    const pinned = isNearBottom(area);
    stickToBottomRef.current = pinned;
    setJumpVisible(!pinned);
  }, []);

  const jumpToLatest = useCallback(() => {
    stickToBottomRef.current = true;
    setJumpVisible(false);
    const area = scrollRef.current;
    if (area) area.scrollTop = area.scrollHeight;
  }, []);

  const submit = (text) => {
    if (!providerStatus.configured || busy || !text.trim()) return;
    setNotice('');
    stickToBottomRef.current = true;
    setJumpVisible(false);
    setInput('');
    void sendMessage({ text: text.trim().slice(0, 2500) });
    requestAnimationFrame(jumpToLatest);
  };

  const handleStop = () => {
    if (!busy) return;
    stop();
    setNotice('Generation stopped. Any received text remains in the conversation.');
    textareaRef.current?.focus();
  };

  const clearConversation = () => {
    if (busy) return;
    setMessages([]);
    setInput('');
    setNotice('Conversation cleared from this browser.');
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    jumpToLatest();
  };

  return <div className="mx-auto max-w-5xl">
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div><p className="small-cap text-indigo-600">FE-06 · Streaming AI interaction</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Career coach</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Discuss job preferences, interview practice and resume writing with a streaming AI assistant. This does not search live vacancies.</p></div>
      <button type="button" onClick={clearConversation} disabled={busy || messages.length === 0} className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">New conversation</button>
    </div>

    {!providerStatus.configured && <div role="alert" className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">AI is not connected yet. Configure the server-side API key in <code>.env.local</code> locally or Vercel Environment Variables to enable live streaming.</div>}

    <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-[#f5f7fc] shadow-sm" aria-label="Streaming career coach chat">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2"><span className="flex size-9 items-center justify-center rounded-xl bg-indigo-100 text-lg text-indigo-700" aria-hidden="true">✦</span><div><p className="text-sm font-bold text-slate-900">ApplyPilot AI</p><p className="text-xs text-slate-500">{providerStatus.provider === 'anthropic' ? 'Claude' : 'Gemini'} · {providerStatus.configured ? 'Provider configured' : 'Setup required'}</p></div></div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${busy ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>{busy ? 'Streaming…' : 'Ready to chat'}</span>
      </header>

      <div className="relative">
        <div ref={scrollRef} onScroll={onScroll} role="log" aria-label="Conversation" aria-live="off" className="h-[min(60vh,580px)] min-h-[320px] space-y-4 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-7">
          {messages.length === 0 && <div className="mx-auto flex max-w-md flex-col items-center justify-center py-12 text-center"><span className="flex size-14 items-center justify-center rounded-2xl bg-indigo-100 text-3xl text-indigo-700" aria-hidden="true">✦</span><h2 className="mt-5 text-xl font-bold text-slate-900">What would you like to work on?</h2><p className="mt-2 text-sm leading-6 text-slate-500">Ask about entry-level applications, interview preparation or presenting your projects with confidence.</p><div className="mt-6 grid w-full gap-2">{suggestions.map(suggestion => <button type="button" key={suggestion} disabled={busy || !providerStatus.configured} onClick={() => submit(suggestion)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60">{suggestion}</button>)}</div></div>}
          {messages.map((message, index) => <ChatBubble key={message.id} message={message} isStreaming={busy && message.role === 'assistant' && index === messages.length - 1} />)}
          {waitingForFirstToken && <ThinkingBubble />}
        </div>
        {jumpVisible && <button type="button" onClick={jumpToLatest} className="absolute bottom-4 left-1/2 min-h-10 -translate-x-1/2 rounded-full border border-indigo-200 bg-white px-4 text-xs font-bold text-indigo-700 shadow-lg hover:bg-indigo-50">↓ Jump to latest</button>}
      </div>

      <div className="border-t border-slate-200 bg-white px-3 py-3 sm:px-5 sm:py-4">
        {(notice || error) && <p role="status" className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">{notice || 'The AI request failed. Please retry after checking your provider settings.'}</p>}
        <form onSubmit={event => { event.preventDefault(); submit(input); }} className="flex items-end gap-2 sm:gap-3">
          <label htmlFor="chat-input" className="sr-only">Your message</label>
          <textarea id="chat-input" ref={textareaRef} rows={2} maxLength={2500} value={input} disabled={!providerStatus.configured || busy} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); submit(input); } }} placeholder="Ask about resumes, interviews or a job search plan…" className="max-h-36 min-h-14 w-full min-w-0 resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm leading-6 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100 sm:px-4" />
          {busy ? <button type="button" onClick={handleStop} className="min-h-12 shrink-0 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white hover:bg-rose-700">■ Stop</button>
            : <button type="submit" disabled={!providerStatus.configured || !input.trim()} className="min-h-12 shrink-0 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300">Send ↗</button>}
        </form>
        <div className="mt-2 flex flex-wrap justify-between gap-1 text-[11px] leading-5 text-slate-500"><span>Enter to send · Shift+Enter for new line · Stop keeps partial text</span><span>Saved locally in this browser · No real job search</span></div>
      </div>
    </section>
    <p className="mt-4 text-xs leading-6 text-slate-500">Chats are saved in this browser only. Avoid sharing passwords, ID numbers or sensitive personal data. AI responses may be inaccurate; verify important advice.</p>
    <span className="sr-only" aria-live="polite">{busy ? 'Assistant responding' : 'Assistant ready'}</span>
  </div>;
}
