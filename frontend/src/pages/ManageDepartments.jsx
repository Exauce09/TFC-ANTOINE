import { useEffect, useState } from 'react'
import { departmentsAPI } from '../api/client'
import RhLayout, { RhEmptyState, RhLoading } from '../components/RhLayout'

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    departmentsAPI
      .list()
      .then(({ data }) => setDepartments(data.results || data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await departmentsAPI.update(editingId, form)
      } else {
        await departmentsAPI.create(form)
      }
      setForm({ name: '', description: '' })
      setEditingId(null)
      load()
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Erreur.')
    }
  }

  const startEdit = (dept) => {
    setEditingId(dept.id)
    setForm({ name: dept.name, description: dept.description })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ name: '', description: '' })
  }

  const totalJobs = departments.reduce((sum, d) => sum + (d.job_count || 0), 0)

  return (
    <RhLayout
      title="Gestion des départements"
      subtitle="Organisez les services Maison Galaxy. Chaque département regroupe les offres d'emploi associées."
    >
      <div className="mb-6">
        <div className="bg-white rounded-xl border px-4 py-3 inline-block text-center">
          <div className="text-xl font-bold text-galaxy-700">{departments.length}</div>
          <div className="text-xs text-slate-500">Départements · {totalJobs} offre(s) active(s)</div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-2xl shadow-sm p-6 mb-6 space-y-4"
      >
        <h2 className="font-bold text-lg text-galaxy-700">
          {editingId ? 'Modifier le département' : 'Ajouter un département'}
        </h2>
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-xl px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded-xl px-3 py-2"
            rows={3}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-galaxy-700 text-white px-5 py-2 rounded-xl text-sm font-medium"
          >
            {editingId ? 'Mettre à jour' : 'Ajouter'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="border px-5 py-2 rounded-xl text-sm"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <RhLoading />
      ) : departments.length === 0 ? (
        <RhEmptyState
          title="Aucun département"
          description="Créez votre premier département pour organiser les offres d'emploi."
        />
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm divide-y">
          {departments.map((d) => (
            <div key={d.id} className="p-5 flex justify-between items-start gap-4 hover:bg-slate-50/50">
              <div>
                <div className="font-bold text-galaxy-700">{d.name}</div>
                <div className="text-sm text-slate-500 mt-1">{d.description || '—'}</div>
                <div className="text-xs text-slate-400 mt-2">
                  {d.job_count} offre(s) active(s)
                </div>
              </div>
              <button
                onClick={() => startEdit(d)}
                className="text-galaxy-700 text-sm font-medium hover:underline shrink-0"
              >
                Modifier
              </button>
            </div>
          ))}
        </div>
      )}
    </RhLayout>
  )
}
