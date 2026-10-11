import Link from 'next/link';
export default function NotFound() {
  return <div className="card-surface mx-auto max-w-xl p-10 text-center"><p className="small-cap text-indigo-600">404 · Not found</p><h1 className="mt-4 text-3xl font-extrabold text-slate-900">That page isn&apos;t here.</h1><p className="mt-3 text-sm text-slate-500">The route might have moved or hasn&apos;t been scaffolded yet.</p><Link href="/dashboard" className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white">Return to dashboard</Link></div>;
}
