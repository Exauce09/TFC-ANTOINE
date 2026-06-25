import re
from typing import Any

from django.conf import settings
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from apps.scoring.parser import normalize_text

FRENCH_STOPWORDS = {
    'le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'et', 'en', 'à', 'au', 'aux',
    'pour', 'par', 'sur', 'dans', 'avec', 'ce', 'cette', 'son', 'sa', 'ses', 'mon', 'ma',
    'mes', 'notre', 'nos', 'votre', 'vos', 'leur', 'leurs', 'qui', 'que', 'quoi', 'dont',
    'où', 'est', 'sont', 'été', 'être', 'avoir', 'a', 'ai', 'as', 'avons', 'avez', 'ont',
    'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'ne', 'pas', 'plus', 'moins',
}

DEGREE_KEYWORDS = [
    'licence', 'bachelor', 'master', 'mba', 'doctorat', 'phd', 'bts', 'dut', 'graduat',
    'diplome', 'diplôme', 'ingenieur', 'ingénieur', 'bac+2', 'bac+3', 'bac+4', 'bac+5',
]


def _extract_years_experience(text: str) -> int:
    patterns = [
        r'(\d+)\s*(?:ans?|années?|years?)\s*(?:d[\']?expérience|experience|exp)',
        r'expérience\s*(?:de\s*)?(\d+)\s*(?:ans?|années?)',
        r'(\d+)\s*(?:ans?|années?)\s*(?:en|dans)',
    ]
    years = []
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        years.extend(int(m) for m in matches)
    return max(years) if years else 0


def _normalize_keyword(kw: str) -> str:
    return normalize_text(kw)


def _score_keywords(job_text: str, cv_text: str, skills: list) -> dict:
    cv_norm = normalize_text(cv_text)
    job_norm = normalize_text(job_text)

    if skills:
        skill_matched = [s for s in skills if _normalize_keyword(s) in cv_norm]
        skill_missing = [s for s in skills if _normalize_keyword(s) not in cv_norm]
        score = (len(skill_matched) / len(skills)) * 100 if skills else 0
        return {
            'score': round(score, 2),
            'matched_keywords': skill_matched,
            'missing_skills': skill_missing,
        }

    all_keywords = set(re.findall(r'[a-zàâäéèêëïîôùûüç]{3,}', job_norm))
    matched = [kw for kw in all_keywords if kw not in FRENCH_STOPWORDS and kw in cv_norm]
    missing = [kw for kw in all_keywords if kw not in FRENCH_STOPWORDS and kw not in cv_norm]
    ratio = len(matched) / max(len(all_keywords - FRENCH_STOPWORDS), 1)
    return {
        'score': round(min(ratio * 100, 100), 2),
        'matched_keywords': matched[:20],
        'missing_skills': missing[:20],
    }


def _score_experience(cv_text: str, min_experience: int) -> dict:
    years = _extract_years_experience(cv_text)
    if min_experience == 0:
        score = 100.0
    elif years >= min_experience:
        score = min(100.0, 70 + (years - min_experience) * 10)
    else:
        score = max(0, (years / min_experience) * 70)
    return {'score': round(score, 2), 'detected_years': years, 'required_years': min_experience}


def _score_degree(cv_text: str, required_degree: str) -> dict:
    if not required_degree:
        return {'score': 100.0, 'degree_found': True, 'required_degree': ''}

    req = required_degree.lower()
    found = req in cv_text or any(d in cv_text for d in DEGREE_KEYWORDS if d in req)
    if not found:
        found = any(d in cv_text for d in DEGREE_KEYWORDS)

    return {
        'score': 100.0 if found else 30.0,
        'degree_found': found,
        'required_degree': required_degree,
    }


def _score_location(cv_text: str, location: str) -> dict:
    loc = location.lower()
    kinshasa_aliases = ['kinshasa', 'rdc', 'congo', 'drc']
    found = loc in cv_text or any(a in cv_text for a in kinshasa_aliases)
    return {'score': 100.0 if found else 50.0, 'location_match': found}


def _score_nlp(job_text: str, cv_text: str, cover_letter: str = '') -> dict:
    combined_cv = f'{cv_text} {cover_letter}'.strip()
    if not combined_cv or not job_text:
        return {'score': 0.0, 'similarity': 0.0}

    vectorizer = TfidfVectorizer(stop_words=list(FRENCH_STOPWORDS), max_features=5000)
    try:
        tfidf = vectorizer.fit_transform([job_text, combined_cv])
        similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        score = round(float(similarity) * 100, 2)
    except ValueError:
        similarity = 0.0
        score = 0.0

    return {'score': score, 'similarity': round(float(similarity), 4)}


def score_application(job_offer, cv_text: str, cover_letter: str = '') -> dict[str, Any]:
    cv_norm = normalize_text(cv_text)
    job_text = f'{job_offer.title} {job_offer.description} {" ".join(job_offer.required_skills or [])}'
    job_norm = normalize_text(job_text)

    keywords_result = _score_keywords(job_norm, cv_norm, job_offer.required_skills or [])
    experience_result = _score_experience(cv_norm, job_offer.min_experience)
    degree_result = _score_degree(cv_norm, job_offer.required_degree)
    location_result = _score_location(cv_norm, job_offer.location)

    rules_score = (
        keywords_result['score'] * 0.40
        + experience_result['score'] * 0.25
        + degree_result['score'] * 0.15
        + location_result['score'] * 0.20
    )

    nlp_result = _score_nlp(job_norm, cv_norm, normalize_text(cover_letter))

    rules_weight = settings.SIGER_SCORING_RULES_WEIGHT
    nlp_weight = settings.SIGER_SCORING_NLP_WEIGHT
    final_score = round(rules_score * rules_weight + nlp_result['score'] * nlp_weight, 2)

    if final_score >= settings.SIGER_SHORTLIST_THRESHOLD:
        recommendation = 'shortlist'
    elif final_score >= settings.SIGER_MANUAL_REVIEW_THRESHOLD:
        recommendation = 'manual_review'
    else:
        recommendation = 'reject_suggested'

    return {
        'final_score': final_score,
        'rules_score': round(rules_score, 2),
        'nlp_score': nlp_result['score'],
        'keywords': keywords_result,
        'experience': experience_result,
        'degree': degree_result,
        'location': location_result,
        'nlp': nlp_result,
        'recommendation': recommendation,
    }
