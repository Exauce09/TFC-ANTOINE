import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { applicationsAPI } from '../api/client'

export default function Apply() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cvFile, setCvFile] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!cvFile) {
      setError('Veuillez joindre votre CV.')
      return
    }
    if (!consent) {
      setError('Vous devez accepter le traitement de vos données.')
      return
    }

    setLoading(true)
    setError('')
    const formData = new FormData()
    formData.append('job_offer', id)
    formData.append('cv_file', cvFile)
    formData.append('cover_letter', coverLetter)
    formData.append('consent_given', 'true')

    try {
      await applicationsAPI.create(formData)
      navigate('/my-applications')
    } catch (err) {
      setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Erreur lors de l\'envoi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-galaxy-700 mb-6">Postuler</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">CV (PDF ou DOCX, max 5 Mo)</label>
          <input type="file" accept=".pdf,.docx,.doc" required
            onChange={(e) => setCvFile(e.target.files[0])}
            className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lettre de motivation (optionnel)</label>
          <textarea rows={5} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-galaxy-500 outline-none" />
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
          <span>
            J'accepte que mes données personnelles soient traitées par Maison Galaxy dans le cadre de ce recrutement
            et que je sois notifié(e) par e-mail et SMS.{' '}
            <a href="/privacy" target="_blank" className="text-galaxy-700 underline">Politique de confidentialité</a>
          </span>
        </label>
        <button type="submit" disabled={loading}
          className="w-full bg-galaxy-700 text-white py-2 rounded-lg font-medium hover:bg-galaxy-500 disabled:opacity-50">
          {loading ? 'Envoi en cours...' : 'Envoyer ma candidature'}
        </button>
      </form>
    </div>
  )
}
