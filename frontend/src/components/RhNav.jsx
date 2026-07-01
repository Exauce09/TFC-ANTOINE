import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/dashboard', label: 'Candidatures' },
  { to: '/dashboard/jobs', label: 'Offres' },
  { to: '/dashboard/reports', label: 'Rapports' },
  { to: '/dashboard/notifications', label: 'Notifications' },
]

export default function RhNav() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <nav className="flex flex-wrap gap-2 mb-6 border-b pb-4 items-center">
      <Link to="/" className="text-sm text-galaxy-700 hover:underline mr-2">← Espace public</Link>
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            pathname === link.to || pathname.startsWith(link.to + '/')
              ? 'bg-galaxy-700 text-white'
              : 'bg-white border text-slate-600 hover:bg-slate-50'
          }`}
        >
          {link.label}
        </Link>
      ))}
      {isAdmin && (
        <Link
          to="/dashboard/departments"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            pathname === '/dashboard/departments'
              ? 'bg-galaxy-700 text-white'
              : 'bg-white border text-slate-600 hover:bg-slate-50'
          }`}
        >
          Départements
        </Link>
      )}
    </nav>
  )
}
