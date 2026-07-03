import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IMAGES } from '../assets/images'
import AnimatedImage from '../components/AnimatedImage'
import PasswordInput from '../components/PasswordInput'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const user = await login(email, password)
      navigate(user.role === 'candidat' ? '/my-applications' : '/dashboard')
    } catch (err) {
      const msg = err.response?.data?.detail
        || err.response?.data?.non_field_errors?.[0]
        || (err.code === 'ERR_NETWORK' ? 'Impossible de joindre le serveur.' : null)
      setError(msg || 'Identifiants incorrects.')
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] grid md:grid-cols-2">
      <div className="hidden md:block relative">
        <AnimatedImage variant="sidepanel" src={IMAGES.candidate} alt="" />
        <div className="absolute inset-0 bg-galaxy-900/60 flex items-center justify-center p-12">
          <div className="text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Bienvenue sur SIGER</h2>
            <p className="text-blue-100">Maison Galaxy Kinshasa — Recrutement intelligent</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-galaxy-700 mb-2">Connexion</h1>
          <p className="text-slate-500 text-sm mb-6">Accédez à votre espace candidat ou RH</p>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border">
            {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-medium mb-1">E-mail</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-galaxy-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe</label>
              <PasswordInput required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-galaxy-700 text-white py-3 rounded-xl font-medium hover:bg-galaxy-500 disabled:opacity-50">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
            <p className="text-sm text-center text-slate-500">
              Pas de compte ? <Link to="/register" className="text-galaxy-700 font-medium">Créer un compte candidat</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
