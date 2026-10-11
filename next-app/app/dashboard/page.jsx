import Link from 'next/link';
import { Icon } from '@/components/icons';
import { SectionHeading } from '@/components/page-section';

export const metadata = { title: 'Dashboard' };

const tiles = [
  { title: 'Job preferences', value: 'Ready to set up', icon: 'sliders', href: '/preferences', note: 'Preference form implementation follows in the next milestone.' },
  { title: 'Resume', value: 'Not uploaded', icon: 'file', href: '/resume', note: 'Resume parsing is planned; no upload is active yet.' },
  { title: 'Job matches', value: 'Coming soon', icon: 'sparkle', href: '/matches', note: 'No AI matching or live job data is connected.' },
  { title: 'Applications', value: 'Not tracked', icon: 'briefcase', href: '/applications', note: 'Application tracking will be implemented later.' },
];

export default function DashboardPage() {
  return <>
    <SectionHeading eyebrow="Workspace overview" title="Make your next move with clarity." description="One place for preferences, resumes, potential matches, and job applications. This first milestone is the app foundation, with future features clearly marked." />
    <div className="relative mb-8 overflow-hidden rounded-[24px] bg-[#23245d] p-7 text-white sm:p-9">
      <div aria-hidden="true" className="absolute -right-24 -top-40 size-96 rounded-full bg-indigo-400/20 blur-3xl" />
      <div className="relative max-w-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100"><span className="size-2 rounded-full bg-emerald-400" /> Foundation milestone</div>
        <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">A workspace that will grow with your search.</h2>
        <p className="mt-3 text-sm leading-7 text-indigo-100">Routes, shared layout, design tokens, and a live health endpoint are in place. Preference saving, matching, and user accounts are not enabled at this stage.</p>
        <div className="mt-6 flex flex-wrap gap-3"><Link className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-50" href="/preferences">Explore preferences <Icon name="arrow" size={17}/></Link><Link className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10" href="/health">Check app health</Link></div>
      </div>
    </div>
    <div className="mb-4 flex items-center justify-between gap-4"><h2 className="text-lg font-bold text-slate-900">Your workspace</h2><span className="text-xs font-medium text-slate-500">4 planned feature areas</span></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{tiles.map((tile) => <Link href={tile.href} key={tile.title} className="card-surface group p-5 transition-transform hover:-translate-y-0.5"><div className="mb-6 flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Icon name={tile.icon}/></div><p className="text-sm font-semibold text-slate-700">{tile.title}</p><p className="mt-2 text-base font-bold text-slate-950">{tile.value}</p><p className="mt-3 min-h-16 text-xs leading-5 text-slate-500">{tile.note}</p><span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:gap-2">View placeholder <Icon name="arrow" size={14}/></span></Link>)}</div>
    <div className="mt-8 grid gap-5 lg:grid-cols-5">
      <section className="card-surface p-6 lg:col-span-3"><div className="flex items-center justify-between"><h2 className="text-base font-bold text-slate-900">Build roadmap</h2><span className="small-cap text-indigo-600">FE-05 → Capstone</span></div><ol className="mt-5 space-y-5">{[['01','Set up the foundation','App Router, Tailwind, shared navigation, and health page.','Complete locally (source scaffold)'],['02','Connect real features','Preferences, resume flow, and user-specific state.','Planned'],['03','Add responsible AI matching','API calls, error states, transparency, and safeguards.','Planned'],['04','Verify and deploy','Accessibility, test coverage, and performance checks.','Planned']].map(([n,t,d,status])=><li key={n} className="flex gap-4"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-extrabold text-indigo-700">{n}</span><div className="min-w-0"><p className="text-sm font-bold text-slate-800">{t}</p><p className="mt-1 text-xs leading-6 text-slate-500">{d}</p><p className="mt-1.5 text-[11px] font-semibold text-indigo-600">{status}</p></div></li>)}</ol></section>
      <section className="card-surface p-6 lg:col-span-2"><div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Icon name="pulse" size={21}/></div><h2 className="mt-5 text-lg font-bold">Health check</h2><p className="mt-3 text-sm leading-7 text-slate-500">Verify that the deployed site can fetch a real JSON response from its own endpoint. No third-party credentials are necessary.</p><Link href="/health" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">Open health page <Icon name="arrow" size={17}/></Link></section>
    </div>
  </>;
}
