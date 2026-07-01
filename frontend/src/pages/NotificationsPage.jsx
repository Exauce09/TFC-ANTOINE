import { useEffect, useState } from 'react'
import { notificationsAPI } from '../api/client'
import RhNav from '../components/RhNav'

export default function NotificationsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notificationsAPI.list().then(({ data }) => {
      setLogs(data.results || data)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <RhNav />
      <h1 className="text-2xl font-bold text-galaxy-700 mb-6">Historique des notifications</h1>

      {loading ? (
        <p className="text-slate-500">Chargement...</p>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Candidat</th>
                <th className="text-left p-4">Offre</th>
                <th className="text-left p-4">Canal</th>
                <th className="text-left p-4">Événement</th>
                <th className="text-left p-4">Destinataire</th>
                <th className="text-left p-4">Statut</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 text-slate-500">
                    {new Date(log.created_at).toLocaleString('fr-FR')}
                  </td>
                  <td className="p-4">{log.candidate_name}</td>
                  <td className="p-4">{log.job_title}</td>
                  <td className="p-4 uppercase">{log.channel}</td>
                  <td className="p-4">{log.template_name}</td>
                  <td className="p-4">{log.recipient}</td>
                  <td className="p-4">
                    <span className={log.status === 'sent' ? 'text-green-600' : 'text-red-600'}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
            <p className="p-8 text-center text-slate-500">Aucune notification enregistrée.</p>
          )}
        </div>
      )}
    </div>
  )
}
