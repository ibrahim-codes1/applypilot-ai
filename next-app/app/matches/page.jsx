import Link from 'next/link';
import { SectionHeading, Placeholder } from '@/components/page-section';

export const metadata = { title: 'AI Job Matches' };

export default function MatchesPage() {
  return <>
    <SectionHeading eyebrow="Relevant opportunities" title="AI job matches" description="Future matching will explain why a verified opportunity fits your experience and preferences." />
    <Placeholder title="Live matching is not connected" blurb="This matching page does not look up actual jobs. In FE-06 you can use the streaming career coach for general career advice; it does not have job-listing tools or resume access." steps={['Choose a trustworthy source of real vacancies.', 'Connect a validated matching tool in FE-07.', 'Show transparent rationales, uncertainty, and official job links.']} />
    <Link href="/chat" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700">Try the streaming career coach</Link>
  </>;
}
