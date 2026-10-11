import { SectionHeading, Placeholder } from '@/components/page-section';
export const metadata = { title: 'Settings' };
export default function SettingsPage() {
  return <><SectionHeading eyebrow="Workspace controls" title="Settings" description="Control future privacy preferences, notifications, and account options."/><Placeholder title="Account settings are planned" blurb="There is no login system, email collection, or notification service connected to the skeleton. Future controls will appear here after requirements and access rules are defined." steps={['Decide whether user accounts are necessary.', 'Document data privacy and consent requirements.', 'Only add settings that connect to implemented behavior.']}/></>;
}
