import { useEffect, useState } from 'react'
import { departmentsAPI } from '../api/client'
import RhNav from '../components/RhNav'

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const load = () => departmentsAPI.list().then(({ data }) => setDepartments(data.results || data))

  useEffect(() => { load() }, [])

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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <RhNav />
      <h1 className="text-2xl font-bold text-galaxy-700 mb-6">Gestion des départements</h1>

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 mb-6 space-y-4">
        {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded-lg px-3 py-2" rows={3} />
        </div>
        <button type="submit" className="bg-galaxy-700 text-white px-4 py-2 rounded-lg text-sm">
          {editingId ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </form>

      <div className="bg-white rounded-xl border divide-y">
        {departments.map((d) => (
          <div key={d.id} className="p-4 flex justify-between items-start">
            <div>
              <div className="font-medium">{d.name}</div>
              <div className="text-sm text-slate-500">{d.description}</div>
              <div className="text-xs text-slate-400 mt-1">{d.job_count} offre(s) active(s)</div>
            </div>
            <button onClick={() => startEdit(d)} className="text-galaxy-700 text-sm hover:underline">Modifier</button>
          </div>
        ))}
      </div>
    </div>
  )
}
