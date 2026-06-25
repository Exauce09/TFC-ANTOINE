import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { jobsAPI } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    jobsAPI.get(id).then(({ data }) => setJob(data))
  }, [id])

  if (!job) return <div className="p-8 text-center text-slate-500">Chargement...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/jobs" className="text-galaxy-700 text-sm hover:underline">← Retour aux offres</Link>
      <div className="bg-white rounded-xl shadow-sm border p-8 mt-4">
        <h1 className="text-2xl font-bold text-galaxy-700">{job.title}</h1>
        <p className="text-slate-500 mt-2">{job.department_name} · {job.location}</p>
        <div className="mt-6 prose prose-slate max-w-none">
          <h3 className="font-semibold">Description</h3>
          <p className="text-slate-700 whitespace-pre-wrap">{job.description}</p>
          <h3 className="font-semibold mt-4">Compétences requises</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {(job.required_skills || []).map((s) => (
              <span key={s} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">{s}</span>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Expérience minimum : {job.min_experience} an(s) · Diplôme : {job.required_degree || 'Non spécifié'}
          </p>
          <p className="text-sm text-slate-500">Date limite : {job.deadline}</p>
        </div>
        <button
          onClick={() => user ? navigate(`/jobs/${id}/apply`) : navigate('/login')}
          className="mt-8 bg-galaxy-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-galaxy-500">
          {user ? 'Postuler maintenant' : 'Se connecter pour postuler'}
        </button>
      </div>
    </div>
  )
}
