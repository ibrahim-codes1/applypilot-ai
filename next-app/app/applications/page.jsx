import { SectionHeading, Placeholder } from '@/components/page-section';
export const metadata = { title: 'Applications' };
export default function ApplicationsPage() {
  return <><SectionHeading eyebrow="Track progress" title="My applications" description="A future timeline of job applications, interviews, offers, and follow-ups."/><Placeholder title="Tracking is coming later" blurb="No applications are currently stored. This placeholder preserves the route so the app can grow without renaming the navigation as features are implemented." steps={['Choose an application record schema and status values.', 'Build create, edit, delete, and filtered list interactions.', 'Decide on persistence and test loading and error cases.']}/></>;
}
