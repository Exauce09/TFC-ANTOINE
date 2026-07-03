import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { applicationsAPI, authAPI, jobsAPI } from '../api/client'
import CandidateLayout from '../components/CandidateLayout'
import AnimatedImage from '../components/AnimatedImage'
import { getJobImage } from '../assets/images'

const STEPS = [
  { id: 1, label: 'Votre profil' },
  { id: 2, label: 'Documents' },
  { id: 3, label: 'Motivation' },
  { id: 4, label: 'Confirmation' },
]

const inputClass = 'w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-galaxy-500 outline-none text-sm'
const labelClass = 'block text-sm font-semibold text-galaxy-700 mb-2'

export default function Apply() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [profile, setProfile] = useState(null)
  const [cvFile, setCvFile] = useState(null)
  const [useProfileCv, setUseProfileCv] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [availabilityDate, setAvailabilityDate] = useState('')
  const [motivation, setMotivation] = useState({ why_position: '', why_company: '', availability_note: '' })
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    Promise.all([
      jobsAPI.get(id).then(({ data }) => data),
      authAPI.getCandidateProfile().then(({ data }) => data).catch(() => null),
    ]).then(([jobData, profileData]) => {
      setJob(jobData)
      setProfile(profileData)
      if (profileData?.profile?.cv_file_name) {
        setUseProfileCv(true)
      }
    })
  }, [id])

  const hasProfileCv = Boolean(profile?.profile?.cv_file_name)
  const profileSummary = profile?.profile || {}

  const validateStep = (s) => {
    setError('')
    if (s === 2) {
      if (!useProfileCv && !cvFile) {
        setError('Veuillez joindre un CV ou utiliser celui de votre profil.')
        return false
      }
      if (useProfileCv && !hasProfileCv) {
        setError('Aucun CV sur votre profil. Complétez votre profil ou joignez un fichier.')
        return false
      }
    }
    if (s === 3) {
      if (!coverLetter.trim()) {
        setError('La lettre de motivation est requise pour cette candidature.')
        return false
      }
      if (!availabilityDate) {
        setError('Indiquez votre date de disponibilité.')
        return false
      }
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(step)) setStep(step + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!consent) {
      setError('Vous devez accepter le traitement de vos données.')
      return
    }

    setLoading(true)
    setError('')
    const formData = new FormData()
    formData.append('job_offer', id)
    formData.append('cover_letter', coverLetter)
    formData.append('consent_given', 'true')
    formData.append('availability_date', availabilityDate)
    formData.append('use_profile_cv', useProfileCv ? 'true' : 'false')
    formData.append('motivation_answers', JSON.stringify(motivation))
    if (!useProfileCv && cvFile) formData.append('cv_file', cvFile)

    try {
      await applicationsAPI.create(formData)
      navigate('/my-applications')
    } catch (err) {
      setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Erreur lors de l\'envoi.')
    } finally {
      setLoading(false)
    }
  }

  if (!job) {
    return (
      <CandidateLayout title="Postuler">
        <p className="text-slate-500">Chargement...</p>
      </CandidateLayout>
    )
  }

  const jobImage = getJobImage(job)

  return (
    <CandidateLayout
      title="Candidature"
      subtitle={`Poste : ${job.title} — ${job.department_name}`}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="flex border-b overflow-x-auto">
              {STEPS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => s.id < step && setStep(s.id)}
                  className={`flex-1 min-w-[100px] py-3 px-2 text-xs sm:text-sm font-medium transition-colors ${
                    step === s.id ? 'bg-galaxy-700 text-white' : step > s.id ? 'bg-galaxy-50 text-galaxy-700' : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  {s.id}. {s.label}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-5">
              {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm border border-red-100">{error}</div>}

              {step === 1 && (
                <>
                  <h3 className="font-semibold text-galaxy-700">Récapitulatif de votre profil</h3>
                  <p className="text-sm text-slate-500">
                    Ces informations proviennent de votre profil candidat.{' '}
                    <Link to="/profile" className="text-galaxy-700 underline">Modifier mon profil</Link>
                  </p>
                  <div className="bg-slate-50 rounded-xl p-5 grid sm:grid-cols-2 gap-4 text-sm">
                    <div><span className="text-slate-500">Nom</span><br /><strong>{profile?.user?.first_name} {profile?.user?.last_name}</strong></div>
                    <div><span className="text-slate-500">Téléphone</span><br /><strong>{profile?.user?.phone || '—'}</strong></div>
                    <div><span className="text-slate-500">Diplôme</span><br /><strong>{profileSummary.diplome || '—'}</strong></div>
                    <div><span className="text-slate-500">Domaine</span><br /><strong>{profileSummary.field_of_study || '—'}</strong></div>
                    <div><span className="text-slate-500">Expérience</span><br /><strong>{profileSummary.years_experience ?? 0} an(s)</strong></div>
                    <div><span className="text-slate-500">Poste actuel</span><br /><strong>{profileSummary.current_position || '—'}</strong></div>
                  </div>
                  {profileSummary.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {profileSummary.skills.map((s) => (
                        <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  )}
                  {!profileSummary.profile_complete && (
                    <div className="bg-amber-50 border border-amber-100 text-amber-800 p-3 rounded-xl text-sm">
                      Profil incomplet — pensez à le compléter pour améliorer votre candidature.
                    </div>
                  )}
                  <button type="button" onClick={nextStep}
                    className="w-full bg-galaxy-700 text-white py-3 rounded-xl font-medium hover:bg-galaxy-500">
                    Continuer →
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <h3 className="font-semibold text-galaxy-700">Documents de candidature</h3>
                  {hasProfileCv && (
                    <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                      useProfileCv ? 'border-galaxy-500 bg-galaxy-50' : 'border-slate-200 hover:bg-slate-50'
                    }`}>
                      <input type="radio" name="cvChoice" checked={useProfileCv}
                        onChange={() => { setUseProfileCv(true); setCvFile(null) }} className="mt-1" />
                      <div>
                        <p className="font-medium text-sm">Utiliser le CV de mon profil</p>
                        <p className="text-xs text-slate-500">{profileSummary.cv_file_name}</p>
                      </div>
                    </label>
                  )}
                  <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    !useProfileCv ? 'border-galaxy-500 bg-galaxy-50' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input type="radio" name="cvChoice" checked={!useProfileCv}
                      onChange={() => setUseProfileCv(false)} className="mt-1" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Joindre un CV spécifique pour cette offre</p>
                      <div className="mt-3 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                        <input type="file" accept=".pdf,.docx,.doc" id="cv"
                          disabled={useProfileCv}
                          onChange={(e) => { setCvFile(e.target.files[0]); setUseProfileCv(false) }}
                          className="hidden" />
                        <label htmlFor="cv" className={`cursor-pointer ${useProfileCv ? 'opacity-50' : ''}`}>
                          <p className="text-sm text-slate-600">{cvFile ? cvFile.name : 'Sélectionner un fichier'}</p>
                          <p className="text-xs text-slate-400 mt-1">PDF ou Word — 5 Mo max</p>
                        </label>
                      </div>
                    </div>
                  </label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)}
                      className="flex-1 border py-3 rounded-xl text-sm font-medium hover:bg-slate-50">← Retour</button>
                    <button type="button" onClick={nextStep}
                      className="flex-1 bg-galaxy-700 text-white py-3 rounded-xl font-medium hover:bg-galaxy-500">Continuer →</button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h3 className="font-semibold text-galaxy-700">Motivation & disponibilité</h3>
                  <div>
                    <label className={labelClass}>Lettre de motivation *</label>
                    <textarea rows={6} required value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
                      className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Pourquoi ce poste vous intéresse ?</label>
                    <textarea rows={3} value={motivation.why_position}
                      onChange={(e) => setMotivation({ ...motivation, why_position: e.target.value })}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Pourquoi Maison Galaxy ?</label>
                    <textarea rows={3} value={motivation.why_company}
                      onChange={(e) => setMotivation({ ...motivation, why_company: e.target.value })}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Date de disponibilité *</label>
                    <input type="date" required value={availabilityDate}
                      onChange={(e) => setAvailabilityDate(e.target.value)} className={inputClass} />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)}
                      className="flex-1 border py-3 rounded-xl text-sm font-medium hover:bg-slate-50">← Retour</button>
                    <button type="button" onClick={nextStep}
                      className="flex-1 bg-galaxy-700 text-white py-3 rounded-xl font-medium hover:bg-galaxy-500">Continuer →</button>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h3 className="font-semibold text-galaxy-700">Confirmation</h3>
                  <div className="bg-slate-50 rounded-xl p-5 text-sm space-y-2">
                    <p><strong>Poste :</strong> {job.title}</p>
                    <p><strong>CV :</strong> {useProfileCv ? `Profil — ${profileSummary.cv_file_name}` : cvFile?.name || '—'}</p>
                    <p><strong>Lettre :</strong> {coverLetter ? `${coverLetter.slice(0, 80)}...` : '—'}</p>
                    <p><strong>Disponibilité :</strong> {availabilityDate || '—'}</p>
                  </div>
                  <label className="flex items-start gap-3 text-sm p-4 border rounded-xl cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
                    <span>
                      J'accepte que mes données personnelles soient traitées par Maison Galaxy
                      et que je sois notifié(e) par e-mail et SMS.{' '}
                      <Link to="/privacy" target="_blank" className="text-galaxy-700 underline">Politique de confidentialité</Link>
                    </span>
                  </label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(3)}
                      className="flex-1 border py-3 rounded-xl text-sm font-medium hover:bg-slate-50">← Retour</button>
                    <button type="submit" disabled={loading}
                      className="flex-1 bg-galaxy-700 text-white py-3 rounded-xl font-medium hover:bg-galaxy-500 disabled:opacity-50">
                      {loading ? 'Envoi en cours...' : 'Envoyer ma candidature'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>

        <aside className="space-y-4">
          <AnimatedImage
            variant="inline"
            src={jobImage}
            alt={job.title}
            className="rounded-2xl w-full h-48 border shadow-sm"
          />
          <div className="bg-white rounded-2xl border p-5 text-sm">
            <h3 className="font-bold text-galaxy-700 mb-3">Récapitulatif de l'offre</h3>
            <ul className="space-y-2 text-slate-600">
              <li>📍 {job.location}</li>
              <li>🏢 {job.department_name}</li>
              <li>📅 Limite : {job.deadline}</li>
              <li>💼 Exp. {job.min_experience} an(s)</li>
              {job.required_degree && <li>🎓 {job.required_degree}</li>}
            </ul>
            <Link to={`/jobs/${id}`} className="text-galaxy-700 text-xs mt-4 inline-block hover:underline">
              Voir le détail complet →
            </Link>
          </div>
        </aside>
      </div>
    </CandidateLayout>
  )
}
