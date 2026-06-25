import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { applicationsAPI, notificationsAPI } from '../api/client'
import ScoreBadge from '../components/ScoreBadge'
import StatusBadge from '../components/StatusBadge'

export default function ApplicationDetail() {
  const { id } = useParams()
  const [app, setApp] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [actionLoading, setActionLoading] = useState(false)
  const [interview, setInterview] = useState({
    interview_date: '', interview_location: 'Siège Maison Galaxy, Kinshasa',
    interview_contact: 'rh@maisongalaxy.cd',
  })

  const load = () => {
    applicationsAPI.get(id).then(({ data }) => setApp(data))
    notificationsAPI.list({ application: id }).then(({ data }) => {
      setNotifications(data.results || data)
    })
  }

  useEffect(() => { load() }, [id])

  const updateStatus = async (status) => {
    setActionLoading(true)
    try {
      const payload = { status }
      if (status === 'convocation') {
        payload.interview_date = interview.interview_date || null
        payload.interview_location = interview.interview_location
        payload.interview_contact = interview.interview_contact
      }
      await applicationsAPI.updateStatus(id, payload)
      load()
    } finally {
      setActionLoading(false)
    }
  }

  if (!app) return <div className="p-8 text-center text-slate-500">Chargement...</div>

  const details = app.score_details || {}

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/dashboard" className="text-galaxy-700 text-sm hover:underline">← Retour au dashboard</Link>

      <div className="bg-white rounded-xl shadow-sm border p-6 mt-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-galaxy-700">{app.candidate_name}</h1>
            <p className="text-slate-500">{app.job_title} · Dossier #{app.id}</p>
            <p className="text-sm text-slate-500 mt-1">{app.candidate_email} · {app.candidate_phone}</p>
          </div>
          <StatusBadge status={app.status} />
        </div>

        <div className="mt-6">
          <ScoreBadge score={app.display_score} recommendation={app.score_recommendation} />
        </div>

        {details.rules_score != null && (
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-2">Détail du scoring</h3>
              <ul className="text-sm space-y-1 text-slate-600">
                <li>Score règles : {details.rules_score}</li>
                <li>Score NLP : {details.nlp_score}</li>
                <li>Recommandation : {details.recommendation}</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-2">Compétences</h3>
              <p className="text-sm text-green-700">
                Trouvées : {(details.keywords?.matched_keywords || []).join(', ') || '—'}
              </p>
              <p className="text-sm text-red-600 mt-1">
                Manquantes : {(details.keywords?.missing_skills || []).join(', ') || '—'}
              </p>
            </div>
          </div>
        )}

        {app.cover_letter && (
          <div className="mt-6">
            <h3 className="font-semibold text-sm mb-2">Lettre de motivation</h3>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{app.cover_letter}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={() => updateStatus('shortlist')} disabled={actionLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
            Valider shortlist
          </button>
          <button onClick={() => updateStatus('refuse')} disabled={actionLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50">
            Refuser
          </button>
        </div>

        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-sm mb-2">Convocation entretien</h3>
          <div className="grid md:grid-cols-3 gap-2 mb-2">
            <input type="datetime-local" value={interview.interview_date}
              onChange={(e) => setInterview({ ...interview, interview_date: e.target.value })}
              className="border rounded px-2 py-1 text-sm" />
            <input value={interview.interview_location}
              onChange={(e) => setInterview({ ...interview, interview_location: e.target.value })}
              className="border rounded px-2 py-1 text-sm" placeholder="Lieu" />
            <input value={interview.interview_contact}
              onChange={(e) => setInterview({ ...interview, interview_contact: e.target.value })}
              className="border rounded px-2 py-1 text-sm" placeholder="Contact" />
          </div>
          <button onClick={() => updateStatus('convocation')} disabled={actionLoading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50">
            Envoyer convocation
          </button>
        </div>

        {notifications.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-sm mb-2">Historique notifications</h3>
            <div className="space-y-2">
              {notifications.map((n) => (
                <div key={n.id} className="text-sm flex justify-between bg-slate-50 p-2 rounded">
                  <span>{n.channel.toUpperCase()} — {n.template_name} → {n.recipient}</span>
                  <span className={n.status === 'sent' ? 'text-green-600' : 'text-red-600'}>{n.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
