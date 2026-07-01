import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { departmentsAPI, jobsAPI } from '../api/client'
import RhNav from '../components/RhNav'
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

  const load = () => {
    setLoading(true)
    Promise.all([
      jobsAPI.list({}),
      departmentsAPI.list(),
    ]).then(([jobsRes, deptRes]) => {
      setJobs(jobsRes.data.results || jobsRes.data)
      setDepartments(deptRes.data.results || deptRes.data)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
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
      required_skills: form.required_skills.split(',').map((s) => s.trim()).filter(Boolean),
    }
    try {
      if (editingId) {
        await jobsAPI.update(editingId, payload)
      } else {
        await jobsAPI.create(payload)
      }
      setShowForm(false)
      load()
    } catch (err) {
      setError(JSON.stringify(err.response?.data) || 'Erreur lors de l\'enregistrement.')
    }
  }

  const closeJob = async (id) => {
    await jobsAPI.update(id, { status: 'closed' })
    load()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <RhNav />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-galaxy-700">Gestion des offres</h1>
        <button onClick={openCreate}
          className="bg-galaxy-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-galaxy-500">
          + Nouvelle offre
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 mb-6 space-y-4">
          <h2 className="font-bold text-lg">{editingId ? 'Modifier l\'offre' : 'Créer une offre'}</h2>
          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Département</label>
              <select required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full border rounded-lg px-3 py-2">
                <option value="">Choisir...</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Titre</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea required rows={4} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Compétences (séparées par virgule)</label>
              <input value={form.required_skills} onChange={(e) => setForm({ ...form, required_skills: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" placeholder="vente, crm, négociation" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expérience min. (ans)</label>
              <input type="number" min="0" value={form.min_experience}
                onChange={(e) => setForm({ ...form, min_experience: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Diplôme requis</label>
              <input value={form.required_degree} onChange={(e) => setForm({ ...form, required_degree: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lieu</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date limite</label>
              <input type="date" required value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Statut</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border rounded-lg px-3 py-2">
                <option value="draft">Brouillon</option>
                <option value="active">Active</option>
                <option value="closed">Clôturée</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-galaxy-700 text-white px-4 py-2 rounded-lg text-sm">Enregistrer</button>
            <button type="button" onClick={() => setShowForm(false)}
              className="border px-4 py-2 rounded-lg text-sm">Annuler</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-slate-500">Chargement...</p>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4">Titre</th>
                <th className="text-left p-4">Département</th>
                <th className="text-left p-4">Statut</th>
                <th className="text-left p-4">Date limite</th>
                <th className="text-left p-4">Candidatures</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-medium">{job.title}</td>
                  <td className="p-4">{job.department_name}</td>
                  <td className="p-4"><StatusBadge status={job.status} /></td>
                  <td className="p-4">{job.deadline}</td>
                  <td className="p-4">{job.application_count ?? 0}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => openEdit(job)} className="text-galaxy-700 hover:underline">Modifier</button>
                    {job.status !== 'closed' && (
                      <button onClick={() => closeJob(job.id)} className="text-red-600 hover:underline">Clôturer</button>
                    )}
                    <Link to={`/jobs/${job.id}`} className="text-slate-500 hover:underline">Voir</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
