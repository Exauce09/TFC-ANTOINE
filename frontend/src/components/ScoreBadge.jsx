import { AiBadge } from './AiScorePanel'

export default function ScoreBadge({ score, recommendation, showAi = false }) {
  if (score == null) {
    return <span className="text-slate-400 text-sm">En attente</span>
  }

  let color = 'bg-red-100 text-red-800'
  let label = 'Faible correspondance'

  if (score >= 70 || recommendation === 'shortlist') {
    color = 'bg-green-100 text-green-800'
    label = 'Shortlist suggérée'
  } else if (score >= 40 || recommendation === 'manual_review') {
    color = 'bg-orange-100 text-orange-800'
    label = 'À revoir'
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 flex-wrap">
        {showAi && <AiBadge compact />}
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${color}`}>
          {score.toFixed(1)}%
        </span>
      </div>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  )
}
