import Link from 'next/link';
import { Icon } from './icons';
import { routes } from '@/lib/routes';

export function NavItems({ onDark = false }) {
  return <nav aria-label="Main navigation" className="grid gap-1.5">
    {routes.map((item) => (
      <Link key={item.href} href={item.href} className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${onDark ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'}`}>
        <Icon name={item.icon} size={19} /> <span>{item.label}</span>
      </Link>
    ))}
  </nav>;
}
