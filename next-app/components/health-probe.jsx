'use client';

import { useEffect, useState } from 'react';
import { Icon } from './icons';

export function HealthProbe() {
  const [requestKey, setRequestKey] = useState(0);
  const [state, setState] = useState({ kind: 'loading', data: null, message: '' });

  useEffect(() => {
    const controller = new AbortController();
    // This fetch runs in the browser and hits the real Next.js route handler.
    fetch('/api/health', { signal: controller.signal, cache: 'no-store' })
      .then(async (res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then((data) => setState({ kind: 'ok', data, message: '' }))
      .catch((err) => { if (err.name !== 'AbortError') setState({ kind: 'error', data: null, message: err.message || 'Request failed' }); });
    return () => controller.abort();
  }, [requestKey]);

  const retry = () => { setState({ kind: 'loading', data: null, message: '' }); setRequestKey((n) => n + 1); };
  return <div className="card-surface p-6 sm:p-8">
    <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Icon name="cloud" size={24}/></div><div><h2 className="text-lg font-bold">Live endpoint response</h2><p className="mt-1 text-xs text-slate-500">GET /api/health · No external service or API key</p></div></div><span role="status" className={`rounded-full px-3 py-1.5 text-xs font-bold ${state.kind === 'ok' ? 'bg-emerald-50 text-emerald-700' : state.kind === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{state.kind === 'ok' ? 'Connected' : state.kind === 'error' ? 'Request failed' : 'Fetching...'}</span></div>
    {state.kind === 'loading' && <p aria-live="polite" className="mt-7 animate-pulse rounded-xl bg-slate-50 p-6 text-sm text-slate-500">Fetching a fresh JSON response...</p>}
    {state.kind === 'error' && <div className="mt-7 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800" role="alert">Could not fetch the health endpoint: {state.message}</div>}
    {state.kind === 'ok' && <div className="mt-7 space-y-5"><div className="grid gap-3 sm:grid-cols-3">{[['Status', state.data.status],['App', state.data.application],['Environment', state.data.environment]].map(([label,value])=><div key={label} className="rounded-xl bg-slate-50 p-4"><p className="small-cap text-slate-400">{label}</p><p className="mt-2 font-bold text-slate-900">{value}</p></div>)}</div><p className="text-xs text-slate-500">Checked at {state.data.checkedAt}</p><div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Fetched JSON</p><pre className="overflow-x-auto text-xs leading-6 text-slate-700">{JSON.stringify(state.data, null, 2)}</pre></div></div>}
    <button type="button" onClick={retry} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700">Fetch again <Icon name="arrow" size={16}/></button>
  </div>;
}
