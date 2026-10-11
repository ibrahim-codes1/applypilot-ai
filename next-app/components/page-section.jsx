import Link from 'next/link';
import { Icon } from './icons';

export function SectionHeading({ eyebrow, title, description }) {
  return <div className="mb-8">
    <span className="small-cap text-indigo-600">{eyebrow}</span>
    <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
    <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-500">{description}</p>
  </div>;
}

export function Placeholder({ title, blurb, steps, badge = 'Planned for upcoming milestone', href = '/dashboard' }) {
  return <div className="page-grid">
    <div className="card-surface overflow-hidden p-7 sm:p-9">
      <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><Icon name="sparkle" size={26}/></div>
      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{badge}</span>
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">{blurb}</p>
      <Link href={href} className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">Return to dashboard <Icon name="arrow" size={17}/></Link>
    </div>
    <div className="card-surface p-7 sm:p-8">
      <h3 className="text-lg font-bold text-slate-900">What comes next</h3>
      <p className="mt-2 text-sm text-slate-500">A realistic, staged path — not a fake working feature.</p>
      <ol className="mt-6 space-y-5">{steps.map((step, i) => <li className="flex gap-3" key={step}><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-700">{String(i + 1).padStart(2,'0')}</span><p className="pt-1 text-sm leading-6 text-slate-600">{step}</p></li>)}</ol>
    </div>
  </div>;
}
