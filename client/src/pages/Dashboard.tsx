import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/PageHeader';

const cards = [
  {
    title: 'Coding Interview',
    description: 'Practice algorithmic and system design questions with AI feedback.',
    href: '/coding',
    icon: '💻',
    color: 'indigo',
  },
  {
    title: 'Behavioral Interview',
    description: 'Master STAR method and common behavioral questions.',
    href: '/behavioral',
    icon: '🗣️',
    color: 'emerald',
  },
  {
    title: 'Resume Upload',
    description: 'Get AI-powered feedback on your resume.',
    href: '/resume',
    icon: '📄',
    color: 'amber',
  },
  {
    title: 'Admin Panel',
    description: 'Manage platform settings and users.',
    href: '/admin',
    icon: '⚙️',
    color: 'slate',
  },
];

export function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.name ?? 'User'}`}
        subtitle="Choose an area to practice and improve your interview skills."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ title, description, href, icon }) => (
          <Link
            key={href}
            to={href}
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-2xl group-hover:bg-indigo-100">
              {icon}
            </div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
            <span className="mt-3 inline-block text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
              Start →
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
