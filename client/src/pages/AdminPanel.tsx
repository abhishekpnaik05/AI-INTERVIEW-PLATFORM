import { PageHeader } from '../components/PageHeader';

export function AdminPanel() {
  return (
    <>
      <PageHeader
        title="Admin Panel"
        subtitle="Manage users, interviews, and platform settings."
      />
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-4 text-slate-600">
          <p>Admin-only features will appear here. Add role-based access control to restrict this page.</p>
          <ul className="list-inside list-disc space-y-1 text-sm">
            <li>User management</li>
            <li>Interview question bank</li>
            <li>Analytics and reports</li>
            <li>System configuration</li>
          </ul>
        </div>
      </div>
    </>
  );
}
