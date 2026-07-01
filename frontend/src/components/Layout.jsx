import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout, isRecruiter } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-galaxy-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg">G</div>
            <div>
              <div className="font-bold text-lg leading-tight">SIGER</div>
              <div className="text-xs text-blue-200">Maison Galaxy Kinshasa</div>
            </div>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/jobs" className="hover:text-blue-200">Offres</Link>
            {user ? (
              <>
                {isRecruiter ? (
                  <Link to="/dashboard" className="hover:text-blue-200">Dashboard RH</Link>
                ) : (
                  <Link to="/my-applications" className="hover:text-blue-200">Mes candidatures</Link>
                )}
                <Link to="/profile" className="hover:text-blue-200">Profil</Link>
                <span className="text-blue-200">{user.first_name}</span>
                <button onClick={handleLogout} className="bg-white/10 px-3 py-1 rounded hover:bg-white/20">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">Connexion</Link>
                <Link to="/register" className="bg-white text-galaxy-700 px-3 py-1 rounded font-medium hover:bg-blue-50">
                  S'inscrire
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-galaxy-900 text-blue-200 text-center py-4 text-sm">
        © 2026 Maison Galaxy Kinshasa — SIGER · <Link to="/privacy" className="underline hover:text-white">Confidentialité</Link>
      </footer>
    </div>
  )
}
