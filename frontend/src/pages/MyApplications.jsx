import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { applicationsAPI } from '../api/client'
import StatusBadge from '../components/StatusBadge'

export default function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    applicationsAPI.list().then(({ data }) => {
      setApplications(data.results || data)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-galaxy-700 mb-6">Mes candidatures</h1>
      {loading ? (
        <p className="text-slate-500">Chargement...</p>
      ) : applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 mb-4">Vous n'avez pas encore postulé.</p>
          <Link to="/jobs" className="text-galaxy-700 font-medium hover:underline">Voir les offres</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-lg">{app.job_title}</h2>
                  <p className="text-sm text-slate-500">Dossier #{app.id} · {new Date(app.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex gap-1">
                    {['recu', 'en_analyse', 'shortlist', 'convocation'].map((step, i) => (
                      <div key={step} className={`h-2 flex-1 rounded-full ${
                        ['recu', 'en_analyse', 'shortlist', 'refuse', 'convocation'].indexOf(app.status) >= i
                          ? 'bg-galaxy-500' : 'bg-slate-200'
                      }`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
