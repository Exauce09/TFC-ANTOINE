import { Link, useLocation } from 'react-router-dom'
import { IMAGES } from '../assets/images'
import AnimatedImage from './AnimatedImage'

const LINKS = [
  { to: '/my-applications', label: 'Mes candidatures' },
  { to: '/jobs', label: 'Parcourir les offres' },
  { to: '/profile', label: 'Mon profil' },
]

export default function CandidateLayout({ children, title, subtitle }) {
  const { pathname } = useLocation()

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="relative bg-galaxy-700 text-white overflow-hidden">
        <AnimatedImage variant="banner" src={IMAGES.candidate} alt="" imgClassName="opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-galaxy-900/90 to-galaxy-700/70" />
        <div className="relative max-w-6xl mx-auto px-4 py-10">
          <span className="text-blue-200 text-sm">Espace candidat</span>
          <h1 className="text-3xl font-bold mt-1">{title}</h1>
          {subtitle && <p className="text-blue-100 mt-2 max-w-xl">{subtitle}</p>}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <nav className="bg-white rounded-2xl border shadow-sm p-4 space-y-1 sticky top-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 mb-2">Menu candidat</p>
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  pathname === link.to || pathname.startsWith(link.to + '/')
                    ? 'bg-galaxy-700 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${pathname === link.to ? 'bg-white' : 'bg-galaxy-400'}`} />
                {link.label}
              </Link>
            ))}
            <hr className="my-3" />
            <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm text-galaxy-700 hover:underline">
              ← Espace public
            </Link>
          </nav>
        </aside>
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  )
}
