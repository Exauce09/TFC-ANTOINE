import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
        || (err.code === 'ERR_NETWORK' ? 'Impossible de joindre le serveur. Vérifiez que le backend est démarré.' : null)
      setError(msg || 'Identifiants incorrects.')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-galaxy-700 mb-6">Connexion</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4 border">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-galaxy-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mot de passe</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-galaxy-500 outline-none" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-galaxy-700 text-white py-2 rounded-lg font-medium hover:bg-galaxy-500 disabled:opacity-50">
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
        <p className="text-sm text-center text-slate-500">
          Pas de compte ? <Link to="/register" className="text-galaxy-700 font-medium">S'inscrire</Link>
        </p>
      </form>
    </div>
  )
}
