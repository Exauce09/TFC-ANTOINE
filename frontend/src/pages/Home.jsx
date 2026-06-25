import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-br from-galaxy-700 to-galaxy-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Recrutement intelligent chez Maison Galaxy
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-8">
            SIGER automatise le tri des candidatures et vous notifie à chaque étape de votre parcours.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/jobs" className="bg-white text-galaxy-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">
              Voir les offres
            </Link>
            <Link to="/register" className="border border-white/40 px-6 py-3 rounded-lg font-semibold hover:bg-white/10">
              Créer un compte
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
        {[
          { title: 'Tri intelligent', desc: 'Scoring hybride par règles métier et analyse sémantique NLP de votre CV.' },
          { title: 'Notifications', desc: 'Accusé de réception par e-mail et SMS dès la soumission de votre candidature.' },
          { title: 'Transparence', desc: 'Suivez en temps réel le statut de votre dossier depuis votre espace candidat.' },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <h3 className="font-bold text-lg text-galaxy-700 mb-2">{item.title}</h3>
            <p className="text-slate-600">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
