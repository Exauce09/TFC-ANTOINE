import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { departmentsAPI, jobsAPI } from '../api/client'
import RhLayout, { RhLoading } from '../components/RhLayout'
import AnimatedImage from '../components/AnimatedImage'
import StatusBadge from '../components/StatusBadge'

const EMPTY_FORM = {
  department: '',
  title: '',
  description: '',
  required_skills: '',
  min_experience: 0,
  required_degree: '',
  location: 'Kinshasa',
  deadline: '',
  status: 'active',
}

export default function ManageJobs() {
  const [jobs, setJobs] = useState([])
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [imageFile, setImageFile] = useState(null)
  const [existingImageUrl, setExistingImageUrl] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([jobsAPI.list({}), departmentsAPI.list()])
      .then(([jobsRes, deptRes]) => {
        setJobs(jobsRes.data.results || jobsRes.data)
        setDepartments(deptRes.data.results || deptRes.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setImageFile(null)
    setExistingImageUrl('')
    setShowForm(true)
    setError('')
  }

  const openEdit = (job) => {
    setEditingId(job.id)
    setForm({
      department: job.department,
      title: job.title,
      description: job.description,
      required_skills: (job.required_skills || []).join(', '),
      min_experience: job.min_experience,
      required_degree: job.required_degree || '',
      location: job.location,
      deadline: job.deadline,
      status: job.status,
    })
    setImageFile(null)
    setExistingImageUrl(job.image_url || '')
    setShowForm(true)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      ...form,
      department: Number(form.department),
      min_experience: Number(form.min_experience),
      required_skills: form.required_skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }
    try {
      let data = payload
      if (imageFile) {
        const fd = new FormData()
        Object.entries(payload).forEach(([key, value]) => {
          if (key === 'required_skills') {
            fd.append(key, JSON.stringify(value))
          } else {
            fd.append(key, value)
          }
        })
        fd.append('image', imageFile)
        data = fd
      }
      if (editingId) {
        await jobsAPI.update(editingId, data)
      } else {
        await jobsAPI.create(data)
      }
      setShowForm(false)
      load()
    } catch (err) {
      setError(JSON.stringify(err.response?.data) || "Erreur lors de l'enregistrement.")
    }
  }

  const closeJob = async (id) => {
    await jobsAPI.update(id, { status: 'closed' })
    load()
  }

  const activeCount = jobs.filter((j) => j.status === 'active').length

  return (
    <RhLayout
      title="Gestion des offres"
      subtitle="Créez et gérez les postes ouverts. Les critères définis alimentent directement le moteur de scoring IA."
    >
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border px-4 py-3 text-center">
            <div className="text-xl font-bold text-galaxy-700">{jobs.length}</div>
            <div className="text-xs text-slate-500">Total offres</div>
          </div>
          <div className="bg-white rounded-xl border px-4 py-3 text-center">
            <div className="text-xl font-bold text-green-700">{activeCount}</div>
            <div className="text-xs text-slate-500">Actives</div>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="bg-galaxy-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-galaxy-500 shadow-sm"
        >
          + Nouvelle offre
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-2xl shadow-sm p-6 mb-6 space-y-4"
        >
          <h2 className="font-bold text-lg text-galaxy-700">
            {editingId ? "Modifier l'offre" : 'Créer une offre'}
          </h2>
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</div>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Département</label>
              <select
                required
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full border rounded-xl px-3 py-2"
              >
                <option value="">Choisir...</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Titre</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded-xl px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Compétences (séparées par virgule)
              </label>
              <input
                value={form.required_skills}
                onChange={(e) => setForm({ ...form, required_skills: e.target.value })}
                className="w-full border rounded-xl px-3 py-2"
                placeholder="vente, crm, négociation"
              />
              <p className="text-xs text-slate-400 mt-1">Utilisées par l'analyse IA des CV</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expérience min. (ans)</label>
              <input
                type="number"
                min="0"
                value={form.min_experience}
                onChange={(e) => setForm({ ...form, min_experience: e.target.value })}
                className="w-full border rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Diplôme requis</label>
              <input
                value={form.required_degree}
                onChange={(e) => setForm({ ...form, required_degree: e.target.value })}
                className="w-full border rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lieu</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date limite</label>
              <input
                type="date"
                required
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full border rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Statut</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border rounded-xl px-3 py-2"
              >
                <option value="draft">Brouillon</option>
                <option value="active">Active</option>
                <option value="closed">Clôturée</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Photo de l'offre (optionnel)</label>
              {existingImageUrl && !imageFile && (
                <AnimatedImage
                  variant="inline"
                  src={existingImageUrl}
                  alt="Photo actuelle"
                  className="h-24 w-full max-w-xs rounded-xl border mb-2"
                />
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setImageFile(e.target.files[0] || null)}
                className="w-full border rounded-xl px-3 py-2 text-sm"
              />
              <p className="text-xs text-slate-400 mt-1">
                JPEG, PNG ou WebP — 5 Mo max. Prioritaire sur l'image par défaut du département.
              </p>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="bg-galaxy-700 text-white px-5 py-2 rounded-xl text-sm font-medium"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border px-5 py-2 rounded-xl text-sm"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <RhLoading />
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-600">Titre</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Département</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Statut</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Date limite</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Candidatures</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b hover:bg-slate-50/80">
                    <td className="p-4 font-medium text-galaxy-700">{job.title}</td>
                    <td className="p-4">{job.department_name}</td>
                    <td className="p-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="p-4">{job.deadline}</td>
                    <td className="p-4">{job.application_count ?? 0}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openEdit(job)}
                          className="text-galaxy-700 hover:underline text-sm"
                        >
                          Modifier
                        </button>
                        {job.status !== 'closed' && (
                          <button
                            onClick={() => closeJob(job.id)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Clôturer
                          </button>
                        )}
                        <Link to={`/jobs/${job.id}`} className="text-slate-500 hover:underline text-sm">
                          Voir
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </RhLayout>
  )
}
