import Link from 'next/link';
import { SectionHeading } from '@/components/page-section';
import { HealthProbe } from '@/components/health-probe';

export const metadata = { title: 'Health Check' };
export default function HealthPage() {
  return <><SectionHeading eyebrow="Environment and diagnostics" title="Health check" description="This screen fetches JSON from a real Next.js Route Handler when you open it. It provides an early integration signal without external APIs or secrets."/><div className="page-grid"><HealthProbe/><aside className="card-surface p-7"><h2 className="text-lg font-bold text-slate-900">What this proves</h2><p className="mt-3 text-sm leading-7 text-slate-600">A successful response verifies that the browser can reach the deployed app&apos;s API endpoint and render returned data. It does not prove that matching, authentication, or storage is implemented.</p><div className="mt-5 rounded-xl bg-indigo-50 p-4 text-xs leading-6 text-indigo-800">For FE-05, a mock data source is allowed. This endpoint returns current server time and explicit feature readiness flags.</div><Link href="/dashboard" className="mt-7 inline-flex text-sm font-semibold text-indigo-700 hover:underline">← Back to dashboard</Link></aside></div></>;
}
