import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { applicationsAPI, jobsAPI } from '../api/client'
import { IMAGES } from '../assets/images'
import AiScorePanel from '../components/AiScorePanel'
import RhLayout, { RhEmptyState, RhLoading } from '../components/RhLayout'
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
    applicationsAPI
      .list({ job_offer: selectedJob })
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
      ? (
          applications.reduce((s, a) => s + (a.display_score || 0), 0) / applications.length
        ).toFixed(1)
      : '—',
    withAiScore: applications.filter((a) => a.display_score != null).length,
  }

  return (
    <RhLayout
      title="Candidatures"
      subtitle="Consultez et triez les dossiers par score IA. Les candidatures sont classées automatiquement par correspondance à l'offre."
      heroImage={IMAGES.rh}
    >
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="border rounded-xl px-4 py-2.5 bg-white min-w-[260px] text-sm shadow-sm focus:ring-2 focus:ring-galaxy-700/20 focus:border-galaxy-700"
        >
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleExport}
          disabled={!selectedJob}
          className="bg-white border px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 shadow-sm disabled:opacity-50"
        >
          Exporter CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Candidatures', value: stats.total },
          { label: 'Shortlist IA', value: stats.shortlist },
          { label: 'Score moyen', value: stats.avgScore, suffix: stats.avgScore !== '—' ? '%' : '' },
          { label: 'Analysées par IA', value: stats.withAiScore },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border shadow-sm p-5 text-center">
            <div className="text-2xl font-bold text-galaxy-700">
              {s.value}
              {s.suffix || ''}
            </div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <RhLoading message="Analyse des candidatures en cours..." />
      ) : applications.length === 0 ? (
        <RhEmptyState
          title="Aucune candidature"
          description="Aucun dossier reçu pour cette offre pour le moment."
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-600">Candidat</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Contact</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Correspondance IA</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Statut</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Date</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-galaxy-700">{app.candidate_name}</td>
                    <td className="p-4 text-slate-500">
                      <div>{app.candidate_email}</div>
                      <div className="text-xs">{app.candidate_phone}</div>
                    </td>
                    <td className="p-4 min-w-[200px]">
                      <ScoreBadge
                        score={app.display_score}
                        recommendation={app.score_recommendation}
                        showAi
                      />
                      {app.score_details?.rules_score != null && (
                        <div className="mt-2">
                          <AiScorePanel
                            compact
                            details={app.score_details}
                            displayScore={app.display_score}
                            recommendation={app.score_recommendation}
                          />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {new Date(app.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="p-4">
                      <Link
                        to={`/dashboard/applications/${app.id}`}
                        className="text-galaxy-700 font-medium hover:underline text-sm"
                      >
                        Voir l'analyse →
                      </Link>
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
