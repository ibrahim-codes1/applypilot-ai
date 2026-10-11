import './globals.css';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';

export const metadata = {
  title: { default: 'ApplyPilot AI — Career Workspace', template: '%s · ApplyPilot AI' },
  description: 'ApplyPilot AI capstone foundation — route scaffold for an early-career job application assistant.',
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <main id="main-content" className="mx-auto w-full max-w-[1280px] px-5 py-8 sm:px-8 sm:py-10 lg:px-11 lg:py-12">{children}</main>
        <footer className="mx-auto max-w-[1280px] px-5 pb-8 text-xs text-slate-400 sm:px-8 lg:px-11">ApplyPilot AI · FE-05 skeleton · Demo content only · No user data collected</footer>
      </div>
    </div>
  </body></html>;
}
