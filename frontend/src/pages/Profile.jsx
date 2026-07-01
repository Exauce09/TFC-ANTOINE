import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../api/client'

export default function Profile() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    password: '',
    password_confirm: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (form.password && form.password !== form.password_confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setLoading(true)
    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
      }
      if (form.password) payload.password = form.password
      await authAPI.updateProfile(payload)
      setMessage('Profil mis à jour avec succès.')
      setForm({ ...form, password: '', password_confirm: '' })
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Erreur lors de la mise à jour.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-galaxy-700 mb-6">Mon profil</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-4">
        {message && <div className="bg-green-50 text-green-700 p-3 rounded text-sm">{message}</div>}
        {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input value={user?.email || ''} disabled className="w-full border rounded-lg px-3 py-2 bg-slate-50" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Prénom</label>
          <input required value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input required value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Téléphone (+243)</label>
          <input required value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nouveau mot de passe (optionnel)</label>
          <input type="password" minLength={8} value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
          <input type="password" value={form.password_confirm}
            onChange={(e) => setForm({ ...form, password_confirm: e.target.value })}
            className="w-full border rounded-lg px-3 py-2" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-galaxy-700 text-white py-2 rounded-lg font-medium disabled:opacity-50">
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  )
}
