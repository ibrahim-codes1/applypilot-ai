# ApplyPilot AI — FE-06: Streaming Career Coach

This extends the already-deployed FE-05 Next.js App Router scaffold inside the same `applypilot-ai` repository. It adds a `/chat` route and a Next.js `/api/chat` server route. The page is an AI **career-preparation coach**, not a live-job search or a resume parser.

## Exact setup for Windows (PowerShell)

1. Copy the `next-app` contents from the patch into your existing repository's `next-app` directory. **Do not delete your existing `package-lock.json` or your `playground/` directory.**
2. In PowerShell:

```powershell
cd C:\Users\Ibrahim\Projects\ApplyPilot-AI\next-app
$env:Path = "D:\Node;$env:Path"
node "D:\node_modules\npm\bin\npm-cli.js" install ai@^7 @ai-sdk/react@^4 @ai-sdk/google@^4 @ai-sdk/anthropic@^4
```

The command updates `package.json` and **regenerates `package-lock.json`**. Both should be committed after verification. We deliberately did not ship a fabricated lockfile.

3. Get a Gemini key from [Google AI Studio](https://aistudio.google.com/apikey) (or use your own Anthropic key). Never send your key to another person, paste it in the chat, or commit it to Git.
4. Create `next-app/.env.local` (this file is gitignored) with:

```dotenv
AI_PROVIDER=google
GOOGLE_GENERATIVE_AI_API_KEY=YOUR_PRIVATE_KEY
GOOGLE_MODEL=gemini-2.5-flash
```

**Optional Claude instead:** use `AI_PROVIDER=anthropic`, `ANTHROPIC_API_KEY=YOUR_PRIVATE_KEY`, and optionally `ANTHROPIC_MODEL=claude-haiku-4-5`.

5. Run checks and development server:

```powershell
node "D:\node_modules\npm\bin\npm-cli.js" run build
node "D:\node_modules\npm\bin\npm-cli.js" run dev
```

Visit `http://localhost:3000/chat`. If no API key is configured, a setup notice is shown instead of a fake AI response.

## What FE-06 implements

- **Server:** `app/api/chat/route.js` → AI SDK `streamText` → UI message stream; key loaded server-side via `lib/ai-config.js`.
- **Client:** `components/chat-workspace.jsx` → AI SDK `useChat`, typed `message.parts`, thinking indicator, streamed text, working Stop action, multi-turn history, new conversation.
- **Scroll:** sticks to bottom only when already near bottom; scroll-up releases it and reveals a **Jump to latest** button.
- **Stop:** aborts the current request, retains received text in the client state, and leaves input available for the next turn. Verify this during a real provider stream.
- **Safe display:** render streamed text as plain text, not mid-stream Markdown/HTML (incomplete fences cannot break layout).
- **Privacy:** localStorage keeps the chat on the user's device across refreshes. No user accounts or server-side chat database yet. Avoid private resume content in shared demo environments.
- **Review:** pure input validation strips untrusted nontext message parts; history length and size are bounded. FE-07 must extend this intentionally for tool calls.

## Verify the live feature before submitting

- [ ] `/chat` renders on desktop (~1280px) and mobile (375px)
- [ ] API key exists **only** in `.env.local` locally and in Vercel Environment Variables; not in GitHub
- [ ] Submit a prompt; text arrives incrementally, not all at once
- [ ] Thinking indicator is visible until first text appears
- [ ] Stop mid-generation; received text remains visible; send another message and get a response
- [ ] Complete at least 3 turns and verify the assistant remembers earlier chat context
- [ ] Scroll up during generation: automatic scroll stops; **Jump to latest** resumes pinning
- [ ] Reload after a completed turn: chat history reloads from localStorage
- [ ] Provider failures show an error notice instead of leaving the UI stuck
- [ ] Next.js production `npm run build` succeeds; `node --test tests/chat-validation.test.mjs` passes
- [ ] Vercel preview deployment builds and `/chat` is accessible to reviewers

## Vercel preview

Existing project: `applypilot-ai`, Root Directory: `next-app`.

Open your Vercel project → **Settings → Environment Variables**. Add `AI_PROVIDER=google` and `GOOGLE_GENERATIVE_AI_API_KEY` for **Preview**. Select **Production** only if the public production site should also have the paid/limited-quota key. Vercel applies new variables to new deployments, so redeploy after setting them. Prefer a feature branch preview until verification passes.

**Public preview abuse risk:** A server-side key does not by itself prevent anonymous visitors from using your quota. Enable Vercel Deployment Protection or add real, shared-storage rate limiting/authentication before broadly publishing a paid model endpoint. This FE-06 practice project is **not** hardened for unrestricted public traffic.

## Reviewer links (replace after pushing)

- Preview: `https://YOUR-FE06-PREVIEW.vercel.app/chat`
- Chat route: `https://github.com/ibrahim-codes1/applypilot-ai/blob/feature/fe06-streaming-chat/next-app/app/api/chat/route.js`
- Client component: `https://github.com/ibrahim-codes1/applypilot-ai/blob/feature/fe06-streaming-chat/next-app/components/chat-workspace.jsx`
- Central prompt/model: `https://github.com/ibrahim-codes1/applypilot-ai/blob/feature/fe06-streaming-chat/next-app/lib/ai-config.js`

These are **target paths**, not claims that a remote branch or preview already exists.

## Verification honesty

I was able to run self-contained Node tests for conversation normalization and scroll threshold. I could **not** install AI SDK dependencies or exercise the actual provider stream in the build environment that generated this patch. The user must run `npm install`, `npm run build`, and live streaming/stop/scroll keyboard checks on Windows and Vercel before treating FE-06 as complete.
