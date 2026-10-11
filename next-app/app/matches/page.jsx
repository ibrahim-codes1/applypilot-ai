import { SectionHeading, Placeholder } from '@/components/page-section';
export const metadata = { title: 'AI Job Matches' };
export default function MatchesPage() {
  return <><SectionHeading eyebrow="Relevant opportunities" title="AI job matches" description="A future view that explains why each opportunity might match your preferences and experience."/><Placeholder title="Matching is planned — not connected" blurb="This screen makes no LLM calls and does not claim to find actual job postings. Real matching requires a trusted job data source, transparent criteria, and a server-only API key." steps={['Define a verifiable job data source and match criteria.', 'Add a server-side AI route with rate limits and useful error states.', 'Display match rationale, uncertainty, and links to original job listings.']}/></>;
}
