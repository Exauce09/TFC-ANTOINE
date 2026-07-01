import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PUBLIC_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/jobs', label: 'Offres' },
  { to: '/a-propos', label: 'À propos' },
]

export default function Layout() {
  const { user, logout, isRecruiter } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-galaxy-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="Maison Galaxy" className="w-10 h-10 rounded-lg" />
              <div>
                <div className="font-bold text-lg leading-tight">SIGER</div>
                <div className="text-xs text-blue-200">Maison Galaxy Kinshasa</div>
              </div>
            </Link>
            <nav className="flex items-center gap-1 sm:gap-4 text-sm">
              {PUBLIC_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-2 py-1 rounded hover:text-blue-200 ${
                    pathname === link.to ? 'text-white font-semibold underline underline-offset-4' : 'text-blue-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <span className="hidden sm:block w-px h-5 bg-white/30 mx-1" />
                  {isRecruiter ? (
                    <Link
                      to="/dashboard"
                      className={`px-2 py-1 rounded ${
                        pathname.startsWith('/dashboard')
                          ? 'bg-white text-galaxy-700 font-semibold'
                          : 'hover:text-blue-200'
                      }`}
                    >
                      Espace RH
                    </Link>
                ) : (
                  <Link to="/my-applications" className={`px-2 py-1 rounded ${
                    pathname.startsWith('/my-applications') || pathname === '/profile' || pathname.includes('/apply')
                      ? 'bg-white/20 font-semibold' : 'hover:text-blue-200'
                  }`}>
                    Espace candidat
                  </Link>
                )}
                  <Link to="/profile" className="hover:text-blue-200 px-2 hidden sm:block">Profil</Link>
                  <span className="text-blue-200 hidden md:inline">{user.first_name}</span>
                  <button onClick={handleLogout} className="bg-white/10 px-3 py-1 rounded hover:bg-white/20 ml-1">
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-blue-200 px-2">Connexion</Link>
                  <Link to="/register" className="bg-white text-galaxy-700 px-3 py-1 rounded font-medium hover:bg-blue-50 ml-1">
                    S'inscrire
                  </Link>
                </>
              )}
            </nav>
          </div>
          {user && isRecruiter && pathname.startsWith('/dashboard') && (
            <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2 text-xs text-blue-200">
              <span>Vous êtes dans l'espace RH.</span>
              <Link to="/" className="text-white underline hover:text-blue-100">
                ← Retour à l'espace public
              </Link>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 bg-slate-50">
        <Outlet />
      </main>
      <footer className="bg-galaxy-900 text-blue-200 py-8">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-bold text-white mb-2">Maison Galaxy Kinshasa</div>
            <p>Système intelligent de gestion de recrutement (SIGER)</p>
          </div>
          <div>
            <div className="font-bold text-white mb-2">Espace public</div>
            <div className="flex flex-col gap-1">
              <Link to="/jobs" className="hover:text-white">Offres d'emploi</Link>
              <Link to="/a-propos" className="hover:text-white">À propos</Link>
              <Link to="/register" className="hover:text-white">Devenir candidat</Link>
            </div>
          </div>
          <div>
            <div className="font-bold text-white mb-2">Légal</div>
            <Link to="/privacy" className="hover:text-white">Politique de confidentialité</Link>
            <p className="mt-2 text-xs">© 2026 Maison Galaxy Kinshasa</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
