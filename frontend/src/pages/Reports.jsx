import { useEffect, useState } from 'react'
import { reportsAPI } from '../api/client'
import RhNav from '../components/RhNav'

export default function Reports() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reportsAPI.summary().then(({ data }) => setReport(data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><RhNav /><p className="text-slate-500">Chargement...</p></div>
  if (!report) return null

  const statusLabels = {
    recu: 'Reçu', en_analyse: 'En analyse', shortlist: 'Shortlist',
    refuse: 'Refusé', convocation: 'Convocation',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <RhNav />
      <h1 className="text-2xl font-bold text-galaxy-700 mb-6">Rapports</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Candidatures totales', value: report.total_applications },
          { label: 'Offres actives', value: report.active_jobs },
          { label: 'Score moyen', value: report.average_score },
          { label: 'Taux conversion', value: `${report.conversion_rate}%` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4 text-center">
            <div className="text-2xl font-bold text-galaxy-700">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold mb-4">Répartition par statut</h2>
          <ul className="space-y-2 text-sm">
            {Object.entries(report.status_counts || {}).map(([status, count]) => (
              <li key={status} className="flex justify-between">
                <span>{statusLabels[status] || status}</span>
                <span className="font-medium">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold mb-4">Notifications</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>Envoyées</span><span className="text-green-600 font-medium">{report.notifications_sent}</span></li>
            <li className="flex justify-between"><span>Échouées</span><span className="text-red-600 font-medium">{report.notifications_failed}</span></li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6 md:col-span-2">
          <h2 className="font-bold mb-4">Candidatures par offre</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Offre</th>
                <th className="text-left py-2">Candidatures</th>
                <th className="text-left py-2">Score moyen</th>
              </tr>
            </thead>
            <tbody>
              {(report.applications_by_job || []).map((row, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">{row.job_offer__title}</td>
                  <td className="py-2">{row.count}</td>
                  <td className="py-2">{row.avg_score ? row.avg_score.toFixed(1) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
