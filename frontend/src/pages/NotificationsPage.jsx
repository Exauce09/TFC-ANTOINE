import { useEffect, useState } from 'react'
import RhLayout, { RhEmptyState, RhLoading } from '../components/RhLayout'

import { notificationsAPI } from '../api/client'

const CHANNEL_LABELS = { email: 'E-mail', sms: 'SMS' }
const STATUS_LABELS = { sent: 'Envoyé', failed: 'Échoué', pending: 'En attente' }

export default function NotificationsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notificationsAPI
      .list()
      .then(({ data }) => {
        setLogs(data.results || data)
      })
      .finally(() => setLoading(false))
  }, [])

  const sentCount = logs.filter((l) => l.status === 'sent').length
  const failedCount = logs.filter((l) => l.status === 'failed').length

  return (
    <RhLayout
      title="Historique des notifications"
      subtitle="Suivi des e-mails et SMS envoyés aux candidats à chaque étape du processus."
    >
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-sm">
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-xl font-bold text-green-700">{sentCount}</div>
          <div className="text-xs text-slate-500">Envoyées</div>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-xl font-bold text-red-600">{failedCount}</div>
          <div className="text-xs text-slate-500">Échouées</div>
        </div>
      </div>

      {loading ? (
        <RhLoading />
      ) : logs.length === 0 ? (
        <RhEmptyState
          title="Aucune notification"
          description="Les notifications apparaîtront ici après l'envoi d'e-mails ou SMS aux candidats."
        />
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-600">Date</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Candidat</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Offre</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Canal</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Événement</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Destinataire</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Statut</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-slate-50/80">
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('fr-FR')}
                    </td>
                    <td className="p-4 font-medium">{log.candidate_name}</td>
                    <td className="p-4">{log.job_title}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          log.channel === 'sms'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {CHANNEL_LABELS[log.channel] || log.channel}
                      </span>
                    </td>
                    <td className="p-4">{log.template_name}</td>
                    <td className="p-4 text-slate-500">{log.recipient}</td>
                    <td className="p-4">
                      <span
                        className={`font-medium ${
                          log.status === 'sent' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {STATUS_LABELS[log.status] || log.status}
                      </span>
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
