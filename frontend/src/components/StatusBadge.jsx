const STATUS_LABELS = {
  recu: 'Reçu',
  en_analyse: 'En analyse',
  shortlist: 'Shortlist',
  refuse: 'Refusé',
  convocation: 'Convocation',
}

const STATUS_COLORS = {
  recu: 'bg-blue-100 text-blue-800',
  en_analyse: 'bg-yellow-100 text-yellow-800',
  shortlist: 'bg-green-100 text-green-800',
  refuse: 'bg-red-100 text-red-800',
  convocation: 'bg-purple-100 text-purple-800',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}
