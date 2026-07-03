import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IMAGES } from '../assets/images'
import AnimatedImage from '../components/AnimatedImage'
import PasswordInput from '../components/PasswordInput'

const FIELDS = [
  { name: 'first_name', label: 'Prénom' },
  { name: 'last_name', label: 'Nom' },
  { name: 'email', label: 'E-mail', type: 'email' },
  { name: 'phone', label: 'Téléphone (+243)' },
]

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
      navigate('/profile')
    } catch (err) {
      const data = err.response?.data
      setError(data ? JSON.stringify(data) : 'Erreur lors de l\'inscription.')
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] grid md:grid-cols-2">
      <div className="hidden md:block relative">
        <AnimatedImage variant="sidepanel" src={IMAGES.careers} alt="" />
        <div className="absolute inset-0 bg-galaxy-700/75 flex flex-col justify-center p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Rejoignez Maison Galaxy</h2>
          <ul className="space-y-3 text-blue-100 text-sm">
            <li>✓ Postulez en ligne en quelques minutes</li>
            <li>✓ Suivez vos candidatures en temps réel</li>
            <li>✓ Recevez des notifications SMS et e-mail</li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-galaxy-700 mb-2">Créer un compte candidat</h1>
          <p className="text-slate-500 text-sm mb-6">Inscription gratuite — complétez ensuite votre profil candidat</p>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border">
            {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm">{error}</div>}
            {FIELDS.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-1">{field.label}</label>
                <input name={field.name} type={field.type || 'text'} required
                  value={form[field.name]} onChange={handleChange}
                  className="w-full border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-galaxy-500 outline-none" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe (8 caractères min.)</label>
              <PasswordInput name="password" required minLength={8}
                value={form.password} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
              <PasswordInput name="password_confirm" required
                value={form.password_confirm} onChange={handleChange} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-galaxy-700 text-white py-3 rounded-xl font-medium hover:bg-galaxy-500 disabled:opacity-50">
              {loading ? 'Inscription...' : 'Créer mon compte'}
            </button>
            <p className="text-sm text-center text-slate-500">
              Déjà inscrit ? <Link to="/login" className="text-galaxy-700 font-medium">Se connecter</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
