import Link from 'next/link';
import { NavItems } from './nav-items';
import { Icon } from './icons';

function Brand({ inverse = false }) {
  return <Link href="/dashboard" className="flex items-center gap-3" aria-label="ApplyPilot AI dashboard">
    <span className="flex size-11 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-950/20"><Icon name="sparkle" size={23} /></span>
    <span className="flex flex-col leading-tight"><span className={`text-[18px] font-bold tracking-tight ${inverse ? 'text-white' : 'text-slate-900'}`}>ApplyPilot<span className="text-indigo-400"> AI</span></span><span className={`text-[11px] font-medium tracking-wider ${inverse ? 'text-slate-400' : 'text-slate-500'}`}>CAREER WORKSPACE</span></span>
  </Link>;
}

export function Sidebar() {
  return <>
    <aside className="hidden min-h-screen w-[260px] shrink-0 flex-col bg-[#11172c] px-5 py-7 lg:flex">
      <div className="px-3"><Brand inverse /></div>
      <div className="mt-12 px-3 text-[11px] font-semibold tracking-[.18em] text-slate-500">WORKSPACE</div>
      <div className="mt-4"><NavItems onDark /></div>
      <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-indigo-400/20 text-indigo-200"><Icon name="shield" size={20}/></div>
        <p className="text-sm font-semibold text-white">Foundation milestone</p>
        <p className="mt-1.5 text-xs leading-5 text-slate-400">Routes are ready. AI integration is planned for the next phase.</p>
        <span className="mt-4 inline-flex rounded-full bg-indigo-400/15 px-3 py-1 text-[11px] font-semibold text-indigo-200">FE-05 · Skeleton</span>
      </div>
    </aside>
    <div className="border-b border-slate-200 bg-white px-5 py-4 lg:hidden">
      <div className="flex items-center justify-between"><Brand /><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">FE-05</span></div>
      <details className="group mt-4 rounded-xl border border-slate-200 bg-slate-50">
        <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700"><Icon name="menu" size={18}/> Browse pages</summary>
        <div className="border-t border-slate-200 p-2"><NavItems /></div>
      </details>
    </div>
  </>;
}
