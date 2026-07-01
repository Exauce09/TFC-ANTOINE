import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { applicationsAPI } from '../api/client'
import ApplicationTimeline from '../components/ApplicationTimeline'
import CandidateLayout from '../components/CandidateLayout'
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
    <CandidateLayout
      title="Mes candidatures"
      subtitle="Suivez l'avancement de vos dossiers en temps réel. Vous serez notifié par e-mail et SMS à chaque étape."
    >
      {loading ? (
        <div className="bg-white rounded-2xl border p-12 text-center text-slate-500">Chargement de vos dossiers...</div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-galaxy-700 font-bold">0</span>
          </div>
          <h2 className="text-xl font-bold text-galaxy-700 mb-2">Aucune candidature</h2>
          <p className="text-slate-500 mb-6">Vous n'avez pas encore postulé à une offre Maison Galaxy.</p>
          <Link to="/jobs"
            className="inline-block bg-galaxy-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-galaxy-500">
            Découvrir les offres
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total', value: applications.length },
              { label: 'En cours', value: applications.filter((a) => !['refuse', 'convocation'].includes(a.status)).length },
              { label: 'Shortlist / Entretien', value: applications.filter((a) => ['shortlist', 'convocation'].includes(a.status)).length },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border p-4 text-center">
                <div className="text-2xl font-bold text-galaxy-700">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>

          {applications.map((app) => (
            <article key={app.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b bg-slate-50/50 flex flex-wrap justify-between gap-4 items-start">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-xl text-galaxy-700">{app.job_title}</h2>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Dossier <strong>#{app.id}</strong> · Déposé le {new Date(app.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <Link to={`/jobs/${app.job_offer}`}
                  className="text-sm text-galaxy-700 border border-galaxy-200 px-3 py-1.5 rounded-lg hover:bg-galaxy-50">
                  Voir l'offre
                </Link>
              </div>
              <div className="p-6">
                <p className="text-sm font-medium text-slate-600 mb-1">Progression de votre candidature</p>
                <ApplicationTimeline status={app.status} />
                {app.status === 'convocation' && app.interview_date && (
                  <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl text-sm">
                    <strong>Convocation entretien</strong>
                    {app.interview_location && <p className="text-slate-600 mt-1">📍 {app.interview_location}</p>}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </CandidateLayout>
  )
}
