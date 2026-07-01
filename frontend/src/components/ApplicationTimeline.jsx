const STEPS = [
  { key: 'recu', label: 'Reçu', desc: 'Candidature enregistrée' },
  { key: 'en_analyse', label: 'Analyse', desc: 'Évaluation de votre profil' },
  { key: 'shortlist', label: 'Shortlist', desc: 'Profil retenu' },
  { key: 'convocation', label: 'Entretien', desc: 'Convocation envoyée' },
]

const ORDER = ['recu', 'en_analyse', 'shortlist', 'convocation', 'refuse']

export default function ApplicationTimeline({ status }) {
  const currentIndex = ORDER.indexOf(status)
  const isRefused = status === 'refuse'

  if (isRefused) {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
        Votre candidature n'a pas été retenue pour ce poste. Nous vous encourageons à postuler à nos autres offres.
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 -z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-galaxy-500 -z-0 transition-all"
          style={{ width: `${Math.min((currentIndex / (STEPS.length - 1)) * 100, 100)}%` }}
        />
        {STEPS.map((step, i) => {
          const done = currentIndex >= ORDER.indexOf(step.key)
          const active = status === step.key
          return (
            <div key={step.key} className="flex flex-col items-center z-10 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                done ? 'bg-galaxy-700 border-galaxy-700 text-white' : 'bg-white border-slate-300 text-slate-400'
              } ${active ? 'ring-4 ring-galaxy-200' : ''}`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-xs mt-2 font-medium ${done ? 'text-galaxy-700' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
