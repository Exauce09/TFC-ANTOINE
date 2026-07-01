export const IMAGES = {
  hero: '/images/hero.jpg',
  office: '/images/office.jpg',
  team: '/images/team.jpg',
  kinshasa: '/images/kinshasa.jpg',
  handshake: '/images/handshake.jpg',
  careers: '/images/careers.jpg',
  candidate: '/images/candidate.jpg',
  jobCommercial: '/images/job-commercial.jpg',
  jobLogistique: '/images/job-logistique.jpg',
  jobIt: '/images/job-it.jpg',
}

export const DEPT_IMAGES = {
  Commercial: IMAGES.jobCommercial,
  Logistique: IMAGES.jobLogistique,
  IT: IMAGES.jobIt,
  RH: IMAGES.careers,
  Direction: IMAGES.kinshasa,
}

const IMAGE_KEY_MAP = {
  commercial: IMAGES.jobCommercial,
  logistique: IMAGES.jobLogistique,
  it: IMAGES.jobIt,
}

export function getJobImage(job) {
  if (!job) return IMAGES.careers
  if (job.image_key && IMAGE_KEY_MAP[job.image_key]) {
    return IMAGE_KEY_MAP[job.image_key]
  }
  if (job.department_name && DEPT_IMAGES[job.department_name]) {
    return DEPT_IMAGES[job.department_name]
  }
  const dept = (job.department_name || '').toLowerCase()
  for (const [key, src] of Object.entries(DEPT_IMAGES)) {
    if (dept.includes(key.toLowerCase())) return src
  }
  return IMAGES.careers
}
