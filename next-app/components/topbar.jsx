import Link from 'next/link';
import { Icon } from './icons';

export function Topbar() {
  return <header className="hidden items-center justify-between border-b border-slate-200/80 bg-white px-8 py-5 lg:flex">
    <div><p className="text-xs font-semibold text-slate-400">YOUR WORKSPACE</p><p className="text-[14px] font-medium text-slate-700">A clearer path to your next role.</p></div>
    <div className="flex items-center gap-3">
      <Link href="/health" className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700"><span className="size-2 rounded-full bg-emerald-500"/> Health check <Icon name="arrow" size={15}/></Link>
      <span className="flex size-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700" aria-label="Demo workspace">AP</span>
    </div>
  </header>;
}
