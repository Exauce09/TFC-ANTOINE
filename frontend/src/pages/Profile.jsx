import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../api/client'
import CandidateLayout from '../components/CandidateLayout'

const SECTIONS = [
  { id: 'identite', label: 'Identité', icon: '👤' },
  { id: 'formation', label: 'Formation', icon: '🎓' },
  { id: 'experience', label: 'Expérience', icon: '💼' },
  { id: 'competences', label: 'Compétences', icon: '⚡' },
  { id: 'cv', label: 'CV par défaut', icon: '📄' },
]

const DIPLOMES = [
  'Certificat', 'Graduat', 'Licence', 'Bac+3', 'Master', 'Doctorat', 'Autre',
]

const inputClass = 'w-full border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-galaxy-500 outline-none text-sm'
const labelClass = 'block text-sm font-medium text-slate-700 mb-1'

export default function Profile() {
  const { user } = useAuth()
  const [section, setSection] = useState('identite')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [profileComplete, setProfileComplete] = useState(false)
  const [cvFile, setCvFile] = useState(null)
  const [existingCv, setExistingCv] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '', password: '', password_confirm: '',
    diplome: '', field_of_study: '', years_experience: 0, current_position: '',
    linkedin: '', bio: '', skills: [],
  })

  useEffect(() => {
    authAPI.getCandidateProfile()
      .then(({ data }) => {
        const u = data.user || {}
        const p = data.profile || {}
        setForm({
          first_name: u.first_name || '',
          last_name: u.last_name || '',
          phone: u.phone || '',
          password: '', password_confirm: '',
          diplome: p.diplome || '',
          field_of_study: p.field_of_study || '',
          years_experience: p.years_experience || 0,
          current_position: p.current_position || '',
          linkedin: p.linkedin || '',
          bio: p.bio || '',
          skills: p.skills || [],
        })
        setExistingCv(p.cv_file_name || '')
        setProfileComplete(p.profile_complete || false)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !form.skills.includes(s)) {
      setForm({ ...form, skills: [...form.skills, s] })
      setSkillInput('')
    }
  }

  const removeSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (form.password && form.password !== form.password_confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('first_name', form.first_name)
      fd.append('last_name', form.last_name)
      fd.append('phone', form.phone)
      fd.append('diplome', form.diplome)
      fd.append('field_of_study', form.field_of_study)
      fd.append('years_experience', String(form.years_experience))
      fd.append('current_position', form.current_position)
      fd.append('linkedin', form.linkedin)
      fd.append('bio', form.bio)
      fd.append('skills', JSON.stringify(form.skills))
      if (form.password) fd.append('password', form.password)
      if (cvFile) fd.append('cv_file', cvFile)

      const { data } = await authAPI.updateCandidateProfile(fd)
      setExistingCv(data.profile?.cv_file_name || '')
      setProfileComplete(data.profile?.profile_complete || false)
      setCvFile(null)
      setForm({ ...form, password: '', password_confirm: '' })
      setMessage('Profil enregistré avec succès.')
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Erreur lors de la mise à jour.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <CandidateLayout title="Mon profil">
        <p className="text-slate-500">Chargement du profil...</p>
      </CandidateLayout>
    )
  }

  return (
    <CandidateLayout
      title="Mon profil candidat"
      subtitle="Complétez votre dossier pour postuler rapidement aux offres Maison Galaxy."
    >
      {!profileComplete && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm mb-6">
          <strong>Profil incomplet.</strong> Renseignez au minimum votre diplôme, domaine d'études et CV par défaut
          pour faciliter vos candidatures.
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        <nav className="lg:col-span-1 bg-white rounded-2xl border shadow-sm p-3 space-y-1 h-fit">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                section === s.id ? 'bg-galaxy-700 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </nav>

        <form onSubmit={handleSubmit} className="lg:col-span-3 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="border-b px-6 py-4 bg-slate-50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-galaxy-700 text-white flex items-center justify-center text-xl font-bold">
                {form.first_name?.[0]}{form.last_name?.[0]}
              </div>
              <div>
                <p className="font-bold text-galaxy-700">{form.first_name} {form.last_name}</p>
                <p className="text-sm text-slate-500">{user?.email}</p>
                {profileComplete && (
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded mt-1 inline-block">
                    Profil complet
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {message && <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm border border-green-100">{message}</div>}
            {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm border border-red-100">{error}</div>}

            {section === 'identite' && (
              <>
                <h3 className="font-semibold text-galaxy-700 text-lg">Identité & coordonnées</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Prénom *</label>
                    <input required value={form.first_name}
                      onChange={(e) => setForm({ ...form, first_name: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Nom *</label>
                    <input required value={form.last_name}
                      onChange={(e) => setForm({ ...form, last_name: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Téléphone (+243) *</label>
                  <input required value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                  <p className="text-xs text-slate-400 mt-1">Utilisé pour les notifications SMS</p>
                </div>
                <div>
                  <label className={labelClass}>LinkedIn (optionnel)</label>
                  <input type="url" value={form.linkedin} placeholder="https://linkedin.com/in/..."
                    onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className={inputClass} />
                </div>
                <hr />
                <p className="text-sm font-semibold text-galaxy-700">Changer le mot de passe</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Nouveau mot de passe</label>
                    <input type="password" minLength={8} value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Confirmer</label>
                    <input type="password" value={form.password_confirm}
                      onChange={(e) => setForm({ ...form, password_confirm: e.target.value })} className={inputClass} />
                  </div>
                </div>
              </>
            )}

            {section === 'formation' && (
              <>
                <h3 className="font-semibold text-galaxy-700 text-lg">Formation</h3>
                <div>
                  <label className={labelClass}>Diplôme le plus élevé *</label>
                  <select required value={form.diplome}
                    onChange={(e) => setForm({ ...form, diplome: e.target.value })}
                    className={inputClass}>
                    <option value="">Sélectionner...</option>
                    {DIPLOMES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Domaine d'études *</label>
                  <input required value={form.field_of_study} placeholder="Ex. Commerce, Informatique, Logistique..."
                    onChange={(e) => setForm({ ...form, field_of_study: e.target.value })} className={inputClass} />
                </div>
              </>
            )}

            {section === 'experience' && (
              <>
                <h3 className="font-semibold text-galaxy-700 text-lg">Expérience professionnelle</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Années d'expérience</label>
                    <input type="number" min={0} max={50} value={form.years_experience}
                      onChange={(e) => setForm({ ...form, years_experience: parseInt(e.target.value, 10) || 0 })}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Poste actuel</label>
                    <input value={form.current_position} placeholder="Ex. Commercial terrain"
                      onChange={(e) => setForm({ ...form, current_position: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Résumé / bio professionnelle</label>
                  <textarea rows={5} value={form.bio}
                    placeholder="Décrivez brièvement votre parcours et vos objectifs..."
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className={inputClass} />
                </div>
              </>
            )}

            {section === 'competences' && (
              <>
                <h3 className="font-semibold text-galaxy-700 text-lg">Compétences</h3>
                <p className="text-sm text-slate-500">Ajoutez vos compétences clés (vente, Python, logistique...)</p>
                <div className="flex gap-2">
                  <input value={skillInput} placeholder="Nouvelle compétence"
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className={inputClass} />
                  <button type="button" onClick={addSkill}
                    className="px-4 py-2 bg-galaxy-700 text-white rounded-xl text-sm hover:bg-galaxy-500 whitespace-nowrap">
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {form.skills.map((s) => (
                    <span key={s} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {s}
                      <button type="button" onClick={() => removeSkill(s)} className="text-blue-400 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </>
            )}

            {section === 'cv' && (
              <>
                <h3 className="font-semibold text-galaxy-700 text-lg">CV par défaut</h3>
                <p className="text-sm text-slate-500">
                  Ce CV sera proposé automatiquement lors de vos candidatures. Vous pourrez en joindre un autre par offre.
                </p>
                {existingCv && (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-sm text-green-700">
                    CV actuel : <strong>{existingCv}</strong>
                  </div>
                )}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-galaxy-400 transition-colors">
                  <input type="file" accept=".pdf,.docx,.doc" id="profile-cv"
                    onChange={(e) => setCvFile(e.target.files[0])} className="hidden" />
                  <label htmlFor="profile-cv" className="cursor-pointer">
                    <div className="text-4xl mb-2">📄</div>
                    <p className="text-sm text-slate-600">
                      {cvFile ? cvFile.name : 'Cliquez pour sélectionner votre CV'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">PDF ou Word — 5 Mo maximum</p>
                  </label>
                </div>
              </>
            )}
          </div>

          <div className="border-t px-6 py-4 bg-slate-50 flex justify-between items-center">
            <p className="text-xs text-slate-400">* Champs recommandés pour un profil complet</p>
            <button type="submit" disabled={saving}
              className="bg-galaxy-700 text-white px-8 py-3 rounded-xl font-medium hover:bg-galaxy-500 disabled:opacity-50">
              {saving ? 'Enregistrement...' : 'Enregistrer le profil'}
            </button>
          </div>
        </form>
      </div>
    </CandidateLayout>
  )
}
