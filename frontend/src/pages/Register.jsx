import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({
    email: '', username: '', first_name: '', last_name: '',
    phone: '+243', password: '', password_confirm: '',
  })
  const [error, setError] = useState('')
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.password_confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    try {
      await register({ ...form, username: form.email.split('@')[0] })
      navigate('/jobs')
    } catch (err) {
      const data = err.response?.data
      setError(data ? JSON.stringify(data) : 'Erreur lors de l\'inscription.')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-galaxy-700 mb-6">Inscription candidat</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4 border">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}
        {['first_name', 'last_name', 'email', 'phone'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1 capitalize">
              {field === 'first_name' ? 'Prénom' : field === 'last_name' ? 'Nom' : field === 'phone' ? 'Téléphone (+243)' : 'E-mail'}
            </label>
            <input name={field} required value={form[field]} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-galaxy-500 outline-none" />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium mb-1">Mot de passe</label>
          <input type="password" name="password" required minLength={8} value={form.password} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-galaxy-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
          <input type="password" name="password_confirm" required value={form.password_confirm} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-galaxy-500 outline-none" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-galaxy-700 text-white py-2 rounded-lg font-medium hover:bg-galaxy-500 disabled:opacity-50">
          {loading ? 'Inscription...' : 'S\'inscrire'}
        </button>
        <p className="text-sm text-center text-slate-500">
          Déjà inscrit ? <Link to="/login" className="text-galaxy-700 font-medium">Se connecter</Link>
        </p>
      </form>
    </div>
  )
}
