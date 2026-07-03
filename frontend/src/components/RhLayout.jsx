import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IMAGES } from '../assets/images'
import AnimatedImage from './AnimatedImage'

const LINKS = [
  { to: '/dashboard', label: 'Candidatures' },
  { to: '/dashboard/jobs', label: 'Offres' },
  { to: '/dashboard/reports', label: 'Rapports' },
  { to: '/dashboard/notifications', label: 'Notifications' },
]

export function RhLoading({ message = 'Chargement...' }) {
  return (
    <div className="bg-white rounded-2xl border p-12 text-center text-slate-500">
      <div className="w-8 h-8 border-2 border-galaxy-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      {message}
    </div>
  )
}

export function RhEmptyState({ title, description, action }) {
  return (
    <div className="bg-white rounded-2xl border p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl text-galaxy-700">—</span>
      </div>
      <h2 className="text-xl font-bold text-galaxy-700 mb-2">{title}</h2>
      {description && <p className="text-slate-500 mb-6 max-w-md mx-auto">{description}</p>}
      {action}
    </div>
  )
}

export default function RhLayout({ children, title, subtitle, heroImage }) {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const isActive = (to) => {
    if (to === '/dashboard') {
      return pathname === '/dashboard' || pathname.startsWith('/dashboard/applications/')
    }
    return pathname === to || pathname.startsWith(to + '/')
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="relative bg-galaxy-700 text-white overflow-hidden">
        <AnimatedImage
          variant="banner"
          src={heroImage || IMAGES.office}
          alt=""
          imgClassName="opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-galaxy-900/90 to-galaxy-700/75" />
        <div className="relative max-w-7xl mx-auto px-4 py-10">
          <span className="text-blue-200 text-sm font-medium">Espace RH · Maison Galaxy</span>
          <h1 className="text-3xl font-bold mt-1">{title}</h1>
          {subtitle && <p className="text-blue-100 mt-2 max-w-2xl">{subtitle}</p>}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-4">
          <nav className="bg-white rounded-2xl border shadow-sm p-4 space-y-1 sticky top-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 mb-2">
              Menu RH
            </p>
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-galaxy-700 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isActive(link.to) ? 'bg-white' : 'bg-galaxy-400'
                  }`}
                />
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/dashboard/departments"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  pathname === '/dashboard/departments'
                    ? 'bg-galaxy-700 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    pathname === '/dashboard/departments' ? 'bg-white' : 'bg-galaxy-400'
                  }`}
                />
                Départements
              </Link>
            )}
            <hr className="my-3" />
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-galaxy-700 hover:underline"
            >
              ← Espace public
            </Link>
          </nav>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-xs text-indigo-900 leading-relaxed">
            <p className="font-semibold text-indigo-800 mb-1">Analyse IA intégrée</p>
            <p>
              SIGER classe les candidatures avec un moteur hybride : règles métier (compétences,
              expérience, diplôme, lieu) + similarité NLP TF-IDF. Aucune API externe requise.
            </p>
          </div>
        </aside>

        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  )
}
