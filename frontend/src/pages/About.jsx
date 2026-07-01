import { Link } from 'react-router-dom'
import { IMAGES } from '../assets/images'

export default function About() {
  return (
    <div>
      <section className="relative h-64 flex items-end text-white overflow-hidden">
        <img src={IMAGES.office} alt="Maison Galaxy" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-galaxy-900/70" />
        <div className="relative max-w-7xl mx-auto px-4 pb-8 w-full">
          <span className="text-blue-200 text-sm">Espace public</span>
          <h1 className="text-4xl font-bold mt-1">À propos de Maison Galaxy</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-galaxy-700 mb-3">Notre entreprise</h2>
            <p className="text-slate-600 leading-relaxed">
              Fondée à Kinshasa, Maison Galaxy est une société multisectorielle présente dans le commerce,
              la logistique, les ressources humaines, la direction et les technologies de l'information.
              Nous employons des professionnels talentueux pour servir nos clients à travers la RDC.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-galaxy-700 mb-3">Notre mission RH</h2>
            <p className="text-slate-600 leading-relaxed">
              Recruter les meilleurs profils grâce à un processus moderne, équitable et transparent.
              SIGER (Système Intelligent de Gestion de Recrutement) nous permet d'évaluer chaque candidature
              avec objectivité tout en gardant une dimension humaine dans la décision finale.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-galaxy-700 mb-3">Nos valeurs</h2>
            <ul className="grid grid-cols-2 gap-3">
              {['Excellence', 'Intégrité', 'Innovation', 'Proximité'].map((v) => (
                <li key={v} className="bg-blue-50 text-galaxy-700 px-4 py-3 rounded-lg font-medium text-center">{v}</li>
              ))}
            </ul>
          </section>
          <Link to="/jobs" className="inline-block bg-galaxy-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-galaxy-500">
            Voir les offres d'emploi
          </Link>
        </div>

        <div className="space-y-6">
          <img src={IMAGES.team} alt="Notre équipe" className="rounded-2xl shadow-lg w-full h-56 object-cover" />
          <img src={IMAGES.handshake} alt="Partenariat" className="rounded-2xl shadow-lg w-full h-56 object-cover" />
          <div className="bg-galaxy-700 text-white rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-2">Contact recrutement</h3>
            <p className="text-blue-100 text-sm">📍 Kinshasa, RDC</p>
            <p className="text-blue-100 text-sm">📧 recrutement@maisongalaxy.cd</p>
            <p className="text-blue-100 text-sm">📱 +243 900 000 099</p>
          </div>
        </div>
      </div>
    </div>
  )
}
