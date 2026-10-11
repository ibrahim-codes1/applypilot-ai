import { SectionHeading, Placeholder } from '@/components/page-section';
export const metadata = { title: 'My Resume' };
export default function ResumePage() {
  return <><SectionHeading eyebrow="Your experience" title="Resume workspace" description="A future place to add a resume, inspect parsed skills, and control what the matching process can use."/><Placeholder title="Resume upload is not live yet" blurb="No document is collected or transmitted in this skeleton. The next build phase will define privacy, file limits, parsing, and the storage approach before accepting uploads." steps={['Specify allowed formats, file limits, and data-retention rules.', 'Build upload and preview states with accessible error feedback.', 'Add parsing, tests, and clear user consent before AI integration.']}/></>;
}
