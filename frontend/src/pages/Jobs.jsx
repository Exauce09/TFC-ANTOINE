import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { departmentsAPI, jobsAPI } from '../api/client'
import { getJobImage, IMAGES } from '../assets/images'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [departments, setDepartments] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      jobsAPI.list(filter ? { department: filter } : {}),
      departmentsAPI.list(),
    ]).then(([jobsRes, deptRes]) => {
      setJobs(jobsRes.data.results || jobsRes.data)
      setDepartments(deptRes.data.results || deptRes.data)
    }).finally(() => setLoading(false))
  }, [filter])

  return (
    <div>
      <section className="relative h-48 flex items-end text-white overflow-hidden">
        <img src={IMAGES.careers} alt="Carrières" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-galaxy-700/80" />
        <div className="relative max-w-7xl mx-auto px-4 pb-6 w-full">
          <span className="text-blue-200 text-sm">Espace public</span>
          <h1 className="text-3xl font-bold">Offres d'emploi — Maison Galaxy</h1>
          <p className="text-blue-100 text-sm mt-1">Consultez et postulez sans compte RH — inscription candidat requise pour postuler</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white min-w-[200px]">
            <option value="">Tous les départements</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <span className="text-sm text-slate-500">{jobs.length} offre(s) disponible(s)</span>
        </div>

        {loading ? (
          <p className="text-slate-500">Chargement...</p>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border">
            <p className="text-slate-500">Aucune offre disponible pour le moment.</p>
            <Link to="/" className="text-galaxy-700 mt-2 inline-block hover:underline">Retour à l'accueil</Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                <div className="md:w-48 h-36 md:h-auto flex-shrink-0">
                  <img
                    src={getJobImage(job)}
                    alt={job.department_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex justify-between items-start gap-4">
                  <div>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                      {job.department_name}
                    </span>
                    <h2 className="font-bold text-xl text-galaxy-700 mt-2">{job.title}</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      📍 {job.location} · Exp. min. {job.min_experience} an(s)
                    </p>
                    <p className="text-sm text-slate-500">📅 Date limite : {job.deadline}</p>
                    {job.required_skills && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {job.required_skills.map((s) => (
                          <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link to={`/jobs/${job.id}`}
                    className="bg-galaxy-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-galaxy-500 whitespace-nowrap flex-shrink-0">
                    Voir / Postuler
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
