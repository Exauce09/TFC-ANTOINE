import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { applicationsAPI, jobsAPI } from '../api/client'
import RhNav from '../components/RhNav'
import ScoreBadge from '../components/ScoreBadge'
import StatusBadge from '../components/StatusBadge'

export default function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState('')
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobsAPI.list({ status: 'active' }).then(({ data }) => {
      const list = data.results || data
      setJobs(list)
      if (list.length > 0) setSelectedJob(String(list[0].id))
    })
  }, [])

  useEffect(() => {
    if (!selectedJob) return
    setLoading(true)
    applicationsAPI.list({ job_offer: selectedJob })
      .then(({ data }) => setApplications(data.results || data))
      .finally(() => setLoading(false))
  }, [selectedJob])

  const handleExport = async () => {
    const { data } = await applicationsAPI.exportCsv(selectedJob)
    const url = window.URL.createObjectURL(new Blob([data]))
    const a = document.createElement('a')
    a.href = url
    a.download = `candidatures_${selectedJob}.csv`
    a.click()
  }

  const stats = {
    total: applications.length,
    shortlist: applications.filter((a) => a.score_recommendation === 'shortlist').length,
    avgScore: applications.length
      ? (applications.reduce((s, a) => s + (a.display_score || 0), 0) / applications.length).toFixed(1)
      : 0,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <RhNav />
      <h1 className="text-2xl font-bold text-galaxy-700 mb-6">Candidatures</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-white min-w-[250px]">
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>{j.title}</option>
          ))}
        </select>
        <button onClick={handleExport}
          className="bg-white border px-4 py-2 rounded-lg text-sm hover:bg-slate-50">
          Exporter CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Candidatures', value: stats.total },
          { label: 'Shortlist suggérée', value: stats.shortlist },
          { label: 'Score moyen', value: stats.avgScore },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4 text-center">
            <div className="text-2xl font-bold text-galaxy-700">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-500">Chargement...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium">Candidat</th>
                <th className="text-left p-4 font-medium">Contact</th>
                <th className="text-left p-4 font-medium">Score</th>
                <th className="text-left p-4 font-medium">Statut</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-medium">{app.candidate_name}</td>
                  <td className="p-4 text-slate-500">
                    <div>{app.candidate_email}</div>
                    <div>{app.candidate_phone}</div>
                  </td>
                  <td className="p-4">
                    <ScoreBadge score={app.display_score} recommendation={app.score_recommendation} />
                  </td>
                  <td className="p-4"><StatusBadge status={app.status} /></td>
                  <td className="p-4 text-slate-500">
                    {new Date(app.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4">
                    <Link to={`/dashboard/applications/${app.id}`}
                      className="text-galaxy-700 font-medium hover:underline">
                      Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.length === 0 && (
            <p className="p-8 text-center text-slate-500">Aucune candidature pour cette offre.</p>
          )}
        </div>
      )}
    </div>
  )
}
