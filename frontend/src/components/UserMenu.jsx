import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function getInitials(user) {
  const first = user?.first_name?.[0] || ''
  const last = user?.last_name?.[0] || ''
  if (first || last) return (first + last).toUpperCase()
  return user?.username?.[0]?.toUpperCase() || '?'
}

function getDisplayName(user) {
  if (user?.first_name) return user.first_name
  return user?.username || 'Compte'
}

export default function UserMenu() {
  const { user, logout, isRecruiter } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/')
  }

  const spaceLink = isRecruiter
    ? { to: '/dashboard', label: 'Espace RH' }
    : { to: '/my-applications', label: 'Espace candidat' }

  const roleLabel =
    user?.role === 'admin' ? 'Admin' : isRecruiter ? 'Recruteur' : 'Candidat'

  const menuItemClass =
    'flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-galaxy-50 hover:text-galaxy-700 transition-colors'

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-full transition-colors ${
          open ? 'bg-white/15' : 'hover:bg-white/10'
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Menu utilisateur"
      >
        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/25 shrink-0">
          {getInitials(user)}
        </span>
        <span className="hidden sm:inline font-medium text-sm max-w-[8rem] truncate">
          {getDisplayName(user)}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-blue-200 transition-transform hidden sm:block ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50"
        >
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="font-semibold text-galaxy-700 truncate">{getDisplayName(user)}</p>
            {user?.email && (
              <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
            )}
            <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-galaxy-50 text-galaxy-600">
              {roleLabel}
            </span>
          </div>

          <Link to={spaceLink.to} role="menuitem" className={menuItemClass} onClick={() => setOpen(false)}>
            <svg className="w-4 h-4 text-galaxy-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {spaceLink.label}
          </Link>

          <Link to="/profile" role="menuitem" className={menuItemClass} onClick={() => setOpen(false)}>
            <svg className="w-4 h-4 text-galaxy-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profil
          </Link>

          <hr className="my-1.5 border-slate-100" />

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      )}
    </div>
  )
}
