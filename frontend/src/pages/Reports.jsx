import { useEffect, useState } from 'react'
import { reportsAPI } from '../api/client'
import { AiBadge } from '../components/AiScorePanel'
import RhLayout, { RhLoading } from '../components/RhLayout'

export default function Reports() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reportsAPI
      .summary()
      .then(({ data }) => setReport(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <RhLayout title="Rapports" subtitle="Vue d'ensemble du recrutement Maison Galaxy.">
        <RhLoading />
      </RhLayout>
    )
  }

  if (!report) return null

  const statusLabels = {
    recu: 'Reçu',
    en_analyse: 'En analyse',
    shortlist: 'Shortlist',
    refuse: 'Refusé',
    convocation: 'Convocation',
  }

  const statusTotal = Object.values(report.status_counts || {}).reduce((a, b) => a + b, 0)

  return (
    <RhLayout
      title="Rapports"
      subtitle="Statistiques globales du recrutement, performances du scoring IA et suivi des notifications."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Candidatures totales', value: report.total_applications },
          { label: 'Offres actives', value: report.active_jobs },
          {
            label: 'Score moyen IA',
            value: report.average_score,
            suffix: '%',
            highlight: true,
          },
          { label: 'Taux conversion', value: `${report.conversion_rate}%` },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border shadow-sm p-5 text-center ${
              s.highlight ? 'bg-indigo-50 border-indigo-100' : 'bg-white'
            }`}
          >
            {s.highlight && (
              <div className="flex justify-center mb-2">
                <AiBadge />
              </div>
            )}
            <div className="text-2xl font-bold text-galaxy-700">
              {s.value}
              {s.suffix || ''}
            </div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-bold text-galaxy-700 mb-4">Répartition par statut</h2>
          <ul className="space-y-3 text-sm">
            {Object.entries(report.status_counts || {}).map(([status, count]) => {
              const pct = statusTotal ? Math.round((count / statusTotal) * 100) : 0
              return (
                <li key={status}>
                  <div className="flex justify-between mb-1">
                    <span>{statusLabels[status] || status}</span>
                    <span className="font-medium">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-galaxy-700 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-bold text-galaxy-700 mb-4">Notifications</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
              <span>Envoyées</span>
              <span className="text-green-700 font-bold">{report.notifications_sent}</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
              <span>Échouées</span>
              <span className="text-red-600 font-bold">{report.notifications_failed}</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-bold text-galaxy-700">Candidatures par offre</h2>
            <AiBadge compact />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="text-left py-3 font-semibold">Offre</th>
                  <th className="text-left py-3 font-semibold">Candidatures</th>
                  <th className="text-left py-3 font-semibold">Score moyen IA</th>
                </tr>
              </thead>
              <tbody>
                {(report.applications_by_job || []).map((row, i) => (
                  <tr key={i} className="border-b hover:bg-slate-50/50">
                    <td className="py-3 font-medium">{row.job_offer__title}</td>
                    <td className="py-3">{row.count}</td>
                    <td className="py-3">
                      {row.avg_score ? (
                        <span className="font-medium text-galaxy-700">
                          {row.avg_score.toFixed(1)}%
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RhLayout>
  )
}
