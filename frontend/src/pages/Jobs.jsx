import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { departmentsAPI, jobsAPI } from '../api/client'

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-galaxy-700 mb-6">Offres d'emploi</h1>

      <div className="mb-6">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-white">
          <option value="">Tous les départements</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-slate-500">Chargement...</p>
      ) : jobs.length === 0 ? (
        <p className="text-slate-500">Aucune offre disponible.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border p-6 flex justify-between items-start">
              <div>
                <h2 className="font-bold text-lg text-galaxy-700">{job.title}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {job.department_name} · {job.location} · Exp. min. {job.min_experience} an(s)
                </p>
                <p className="text-sm text-slate-500">Date limite : {job.deadline}</p>
                {job.required_skills && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.required_skills.map((s) => (
                      <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                )}
              </div>
              <Link to={`/jobs/${job.id}`}
                className="bg-galaxy-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-galaxy-500 whitespace-nowrap">
                Voir / Postuler
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
