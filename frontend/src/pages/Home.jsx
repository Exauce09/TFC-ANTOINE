import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { jobsAPI } from '../api/client'
import { IMAGES, getJobImage } from '../assets/images'

export default function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([])

  useEffect(() => {
    jobsAPI.list().then(({ data }) => {
      const list = data.results || data
      setFeaturedJobs(list.slice(0, 3))
    }).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[520px] flex items-center text-white overflow-hidden">
        <img
          src={IMAGES.hero}
          alt="Équipe Maison Galaxy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-galaxy-900/95 via-galaxy-700/85 to-galaxy-700/60" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <span className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm mb-4">
            Espace public — Carrières Maison Galaxy
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-3xl leading-tight">
            Construisez votre avenir avec Maison Galaxy Kinshasa
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mb-8">
            Découvrez nos offres d'emploi, postulez en ligne et suivez votre candidature grâce à SIGER,
            notre plateforme de recrutement intelligent.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/jobs"
              className="bg-white text-galaxy-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 shadow-lg">
              Voir les offres d'emploi
            </Link>
            <Link to="/a-propos"
              className="border-2 border-white/60 px-8 py-3 rounded-xl font-semibold hover:bg-white/10">
              Découvrir l'entreprise
            </Link>
            <Link to="/register"
              className="bg-galaxy-500 px-8 py-3 rounded-xl font-semibold hover:bg-galaxy-700 shadow-lg">
              Créer un compte candidat
            </Link>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '5+', label: 'Départements' },
            { value: 'Kinshasa', label: 'Siège principal' },
            { value: 'SIGER', label: 'Tri intelligent' },
            { value: '24h', label: 'Accusé de réception' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl md:text-3xl font-bold text-galaxy-700">{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* À propos + image */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative rounded-2xl overflow-hidden shadow-xl h-80">
          <img src={IMAGES.kinshasa} alt="Kinshasa" className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <p className="text-white font-medium">Maison Galaxy — Kinshasa, RDC</p>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-galaxy-700 mb-4">Qui sommes-nous ?</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Maison Galaxy est une entreprise dynamique basée à Kinshasa, active dans le commerce,
            la logistique, les technologies et la direction. Nous recrutons des talents passionnés
            pour accompagner notre croissance en République Démocratique du Congo.
          </p>
          <p className="text-slate-600 leading-relaxed mb-6">
            Notre plateforme SIGER garantit un processus de recrutement transparent, rapide et équitable
            pour chaque candidat.
          </p>
          <Link to="/a-propos" className="text-galaxy-700 font-semibold hover:underline">
            En savoir plus sur Maison Galaxy →
          </Link>
        </div>
      </section>

      {/* Offres en vedette */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-galaxy-700">Offres récentes</h2>
              <p className="text-slate-500 mt-1">Postes ouverts à Kinshasa — espace public</p>
            </div>
            <Link to="/jobs" className="text-galaxy-700 font-medium hover:underline hidden sm:block">
              Toutes les offres →
            </Link>
          </div>
          {featuredJobs.length === 0 ? (
            <p className="text-slate-500">Chargement des offres...</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-36 relative overflow-hidden">
                    <img src={getJobImage(job)} alt={job.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 left-3 text-white text-sm font-medium bg-black/50 backdrop-blur px-2 py-1 rounded">
                      {job.department_name}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-galaxy-700 text-lg">{job.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{job.location} · Exp. {job.min_experience} an(s)</p>
                    <p className="text-xs text-slate-400 mt-2">Date limite : {job.deadline}</p>
                    <Link to={`/jobs/${job.id}`}
                      className="mt-4 inline-block bg-galaxy-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-galaxy-500">
                      Consulter l'offre
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8 sm:hidden">
            <Link to="/jobs" className="text-galaxy-700 font-medium">Toutes les offres →</Link>
          </div>
        </div>
      </section>

      {/* Avantages SIGER */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-galaxy-700 text-center mb-12">Pourquoi postuler via SIGER ?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { img: IMAGES.team, title: 'Tri intelligent', desc: 'Votre CV est analysé automatiquement pour une évaluation objective et rapide.' },
            { img: IMAGES.handshake, title: 'Notifications SMS & e-mail', desc: 'Recevez un accusé de réception et des mises à jour à chaque étape.' },
            { img: IMAGES.careers, title: 'Suivi transparent', desc: 'Consultez le statut de votre dossier depuis votre espace candidat.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl overflow-hidden border bg-white shadow-sm">
              <img src={item.img} alt={item.title} className="w-full h-44 object-cover" />
              <div className="p-6">
                <h3 className="font-bold text-lg text-galaxy-700 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="relative py-20 text-white overflow-hidden">
        <img src={IMAGES.office} alt="Bureaux" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-galaxy-900/80" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à rejoindre Maison Galaxy ?</h2>
          <p className="text-blue-100 mb-8">
            Parcourez nos offres publiques, créez votre compte et déposez votre candidature en quelques minutes.
          </p>
          <Link to="/register"
            className="inline-block bg-white text-galaxy-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50">
            Commencer maintenant
          </Link>
        </div>
      </section>
    </div>
  )
}
