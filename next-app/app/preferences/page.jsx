import { SectionHeading, Placeholder } from '@/components/page-section';
export const metadata = { title: 'Job Preferences' };
export default function PreferencesPage() {
  return <><SectionHeading eyebrow="Personalize your search" title="Job preferences" description="Define the work you want to find. The full preference form will be carried over from the verified Week 2 workflow after integration review."/><Placeholder title="Preference capture is next" blurb="The Week 2 'workflow-precise' form lives on a separate experimental branch. This FE-05 route is intentionally a placeholder until the feature is adapted to React, retested, and merged." steps={['Convert the reviewed job preference form into a small Client Component.', 'Validate required title and location, and keep minimum salary optional.', 'Add accessible error handling and test persistence before integrating matching.']}/></>;
}
