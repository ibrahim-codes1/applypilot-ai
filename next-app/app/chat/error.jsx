
'use client';

import Link from 'next/link';

export default function ChatError({ reset }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4 py-10">
      <section
        role="alert"
        className="w-full rounded-3xl border border-rose-200 bg-white p-6 text-center shadow-sm sm:p-10"
      >
        <div
          aria-hidden="true"
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-3xl text-rose-700"
        >
          !
        </div>

        <h1 className="mt-6 text-2xl font-bold text-slate-900">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-600">
          We couldn't display your AI chat right now.
          This may be a temporary problem.
        </p>

        <p className="mt-2 text-sm text-slate-500">
          You can try loading the chat again or return
          to your dashboard.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="min-h-11 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Try Again
          </button>

          <Link
            href="/dashboard"
            className="flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
