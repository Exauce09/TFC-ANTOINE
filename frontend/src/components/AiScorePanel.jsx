export function AiBadge({ compact = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium bg-indigo-100 text-indigo-800 ${
        compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      {compact ? 'IA' : 'Analyse IA'}
    </span>
  )
}

function ScoreBar({ label, value, weight }) {
  const pct = Math.min(100, Math.max(0, value ?? 0))
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-galaxy-700">
          {pct.toFixed(1)}%{weight ? ` · poids ${weight}` : ''}
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-galaxy-700 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

const RECOMMENDATION_LABELS = {
  shortlist: 'Shortlist suggérée',
  manual_review: 'Révision manuelle',
  reject_suggested: 'Non recommandé',
  pending: 'En attente',
}

export default function AiScorePanel({ details, displayScore, recommendation, compact = false }) {
  if (!details || details.rules_score == null) {
    return (
      <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-500">
        <AiBadge /> <span className="ml-2">Score en cours de calcul...</span>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <AiBadge />
        <span className="font-bold text-galaxy-700">{displayScore?.toFixed(1)}%</span>
        <span className="text-slate-500">
          Règles {details.rules_score?.toFixed(1)} · NLP {details.nlp_score?.toFixed(1)}
        </span>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AiBadge />
            <h3 className="font-bold text-galaxy-700">Rapport d'analyse IA</h3>
          </div>
          <p className="text-xs text-slate-500">
            Moteur hybride SIGER — règles métier (60 %) + similarité textuelle TF-IDF (40 %)
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-galaxy-700">{displayScore?.toFixed(1)}%</div>
          <div className="text-xs text-slate-500">correspondance globale</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <ScoreBar label="Score règles métier" value={details.rules_score} />
        <ScoreBar label="Score NLP (TF-IDF)" value={details.nlp_score} />
        <ScoreBar label="Compétences" value={details.keywords?.score} weight="40 %" />
        <ScoreBar label="Expérience" value={details.experience?.score} weight="25 %" />
        <ScoreBar label="Diplôme" value={details.degree?.score} weight="15 %" />
        <ScoreBar label="Localisation" value={details.location?.score} weight="20 %" />
      </div>

      <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-indigo-100">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Compétences trouvées</p>
          <p className="text-sm text-green-700">
            {(details.keywords?.matched_keywords || []).join(', ') || '—'}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Compétences manquantes</p>
          <p className="text-sm text-red-600">
            {(details.keywords?.missing_skills || []).join(', ') || '—'}
          </p>
        </div>
        {details.experience && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Expérience détectée</p>
            <p className="text-sm text-slate-600">
              {details.experience.detected_years} an(s) détecté(s)
              {details.experience.required_years > 0 &&
                ` · ${details.experience.required_years} requis`}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Recommandation IA</p>
          <p className="text-sm font-medium text-galaxy-700">
            {RECOMMENDATION_LABELS[recommendation || details.recommendation] ||
              details.recommendation ||
              '—'}
          </p>
        </div>
      </div>
    </div>
  )
}
