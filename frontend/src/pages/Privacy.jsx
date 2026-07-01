import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 prose prose-slate">
      <h1>Politique de confidentialité</h1>
      <p>
        Maison Galaxy Kinshasa collecte les données personnelles des candidats (nom, e-mail, téléphone, CV)
        uniquement dans le cadre du processus de recrutement via SIGER.
      </p>
      <h2>Utilisation des données</h2>
      <ul>
        <li>Évaluation automatique et manuelle des candidatures</li>
        <li>Notifications par e-mail et SMS sur l'avancement du dossier</li>
        <li>Conservation pendant 12 mois maximum après clôture du recrutement</li>
      </ul>
      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l'accès, la rectification ou la suppression de vos données en contactant
        {' '}<a href="mailto:rh@maisongalaxy.cd">rh@maisongalaxy.cd</a>.
      </p>
      <Link to="/" className="text-galaxy-700">← Retour à l'accueil</Link>
    </div>
  )
}
