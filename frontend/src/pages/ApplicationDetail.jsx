import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { applicationsAPI, notificationsAPI } from '../api/client'
import AiScorePanel from '../components/AiScorePanel'
import RhLayout, { RhLoading } from '../components/RhLayout'
import ScoreBadge from '../components/ScoreBadge'
import StatusBadge from '../components/StatusBadge'

export default function ApplicationDetail() {
  const { id } = useParams()
  const [app, setApp] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [actionLoading, setActionLoading] = useState(false)
  const [interview, setInterview] = useState({
    interview_date: '',
    interview_location: 'Siège Maison Galaxy, Kinshasa',
    interview_contact: 'rh@maisongalaxy.cd',
  })
  const [finalScore, setFinalScore] = useState('')

  const load = () => {
    applicationsAPI.get(id).then(({ data }) => {
      setApp(data)
      setFinalScore(data.final_score ?? data.auto_score ?? '')
    })
    notificationsAPI.list({ application: id }).then(({ data }) => {
      setNotifications(data.results || data)
    })
  }

  useEffect(() => {
    load()
  }, [id])

  const saveScore = async () => {
    setActionLoading(true)
    try {
      await applicationsAPI.updateStatus(id, {
        status: app.status,
        final_score: Number(finalScore),
      })
      load()
    } finally {
      setActionLoading(false)
    }
  }

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

  if (!app) {
    return (
      <RhLayout title="Détail candidature" subtitle="Chargement du dossier...">
        <RhLoading message="Chargement du dossier candidat..." />
      </RhLayout>
    )
  }

  const details = app.score_details || {}

  return (
    <RhLayout
      title={app.candidate_name}
      subtitle={`${app.job_title} · Dossier #${app.id}`}
    >
      <Link
        to="/dashboard"
        className="inline-flex items-center text-galaxy-700 text-sm font-medium hover:underline mb-6"
      >
        ← Retour aux candidatures
      </Link>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <p className="text-sm text-slate-500">
                {app.candidate_email} · {app.candidate_phone}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Reçu le {new Date(app.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <StatusBadge status={app.status} />
          </div>

          <div className="mt-4">
            <ScoreBadge
              score={app.display_score}
              recommendation={app.score_recommendation}
              showAi
            />
          </div>
        </div>

        <AiScorePanel
          details={details}
          displayScore={app.display_score}
          recommendation={app.score_recommendation}
        />

        {app.cover_letter && (
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h3 className="font-bold text-galaxy-700 mb-3">Lettre de motivation</h3>
            <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
              {app.cover_letter}
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="font-bold text-galaxy-700 mb-4">Décision RH</h3>

          <div className="flex flex-wrap items-end gap-3 mb-6">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Ajuster score final (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={finalScore}
                onChange={(e) => setFinalScore(e.target.value)}
                className="border rounded-xl px-3 py-2 text-sm w-28"
              />
            </div>
            <button
              onClick={saveScore}
              disabled={actionLoading}
              className="bg-galaxy-700 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
            >
              Enregistrer score
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => updateStatus('shortlist')}
              disabled={actionLoading}
              className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              Valider shortlist
            </button>
            <button
              onClick={() => updateStatus('refuse')}
              disabled={actionLoading}
              className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              Refuser
            </button>
          </div>

          <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100">
            <h4 className="font-semibold text-sm text-purple-900 mb-3">Convocation entretien</h4>
            <div className="grid md:grid-cols-3 gap-3 mb-3">
              <input
                type="datetime-local"
                value={interview.interview_date}
                onChange={(e) => setInterview({ ...interview, interview_date: e.target.value })}
                className="border rounded-xl px-3 py-2 text-sm bg-white"
              />
              <input
                value={interview.interview_location}
                onChange={(e) => setInterview({ ...interview, interview_location: e.target.value })}
                className="border rounded-xl px-3 py-2 text-sm bg-white"
                placeholder="Lieu"
              />
              <input
                value={interview.interview_contact}
                onChange={(e) => setInterview({ ...interview, interview_contact: e.target.value })}
                className="border rounded-xl px-3 py-2 text-sm bg-white"
                placeholder="Contact"
              />
            </div>
            <button
              onClick={() => updateStatus('convocation')}
              disabled={actionLoading}
              className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              Envoyer convocation
            </button>
          </div>
        </div>

        {notifications.length > 0 && (
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h3 className="font-bold text-galaxy-700 mb-4">Historique notifications</h3>
            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="text-sm flex flex-wrap justify-between gap-2 bg-slate-50 p-3 rounded-xl"
                >
                  <span>
                    {n.channel.toUpperCase()} — {n.template_name} → {n.recipient}
                  </span>
                  <span className={n.status === 'sent' ? 'text-green-600 font-medium' : 'text-red-600'}>
                    {n.status === 'sent' ? 'Envoyé' : 'Échoué'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </RhLayout>
  )
}
