import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { jobsAPI } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { getJobImage } from '../assets/images'
import AnimatedImage from '../components/AnimatedImage'

export default function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    jobsAPI.get(id).then(({ data }) => setJob(data))
  }, [id])

  if (!job) return <div className="p-8 text-center text-slate-500">Chargement...</div>

  const jobImage = getJobImage(job)

  return (
    <div>
      <section className="relative h-56 flex items-end text-white overflow-hidden">
        <AnimatedImage variant="banner" src={jobImage} alt={job.title} />
        <div className="absolute inset-0 bg-galaxy-700/75" />
        <div className="relative max-w-3xl mx-auto px-4 pb-5 w-full">
          <Link to="/jobs" className="text-blue-200 text-sm hover:text-white">← Espace public / Offres</Link>
          <h1 className="text-2xl font-bold mt-1">{job.title}</h1>
          <p className="text-blue-100 text-sm">{job.department_name} · {job.location}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="mt-2 prose prose-slate max-w-none">
            <h3 className="font-semibold text-galaxy-700">Description du poste</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{job.description}</p>
            <h3 className="font-semibold mt-4 text-galaxy-700">Compétences requises</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {(job.required_skills || []).map((s) => (
                <span key={s} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">{s}</span>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm bg-slate-50 rounded-xl p-4">
              <div><span className="text-slate-500">Expérience min.</span><br /><strong>{job.min_experience} an(s)</strong></div>
              <div><span className="text-slate-500">Diplôme</span><br /><strong>{job.required_degree || 'Non spécifié'}</strong></div>
              <div><span className="text-slate-500">Lieu</span><br /><strong>{job.location}</strong></div>
              <div><span className="text-slate-500">Date limite</span><br /><strong>{job.deadline}</strong></div>
            </div>
          </div>
          <button
            onClick={() => user ? navigate(`/jobs/${id}/apply`) : navigate('/login')}
            className="mt-8 w-full sm:w-auto bg-galaxy-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-galaxy-500">
            {user ? 'Postuler maintenant' : 'Se connecter pour postuler'}
          </button>
        </div>
      </div>
    </div>
  )
}
