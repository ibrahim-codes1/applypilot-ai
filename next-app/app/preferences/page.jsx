
import JobPreferencesForm from "@/components/job-preferences-form";

export const metadata = {
  title: "Job Preferences",
};

export default function PreferencesPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-3 text-3xl font-bold">
        Job Preferences
      </h1>

      <p className="mb-6 text-slate-600">
        Set your preferred role, work arrangement,
        location, and skills.
      </p>

      <JobPreferencesForm />
    </main>
  );
}
