from django.test import TestCase

from apps.jobs.models import Department, JobOffer
from apps.scoring.engine import score_application


class ScoringEngineTests(TestCase):
    def setUp(self):
        dept = Department.objects.create(name='Commercial')
        self.job = JobOffer.objects.create(
            department=dept,
            title='Commercial terrain Kinshasa',
            description='Vente et prospection clients B2B à Kinshasa. Négociation et suivi commercial.',
            required_skills=['vente', 'prospection', 'négociation', 'crm'],
            min_experience=2,
            required_degree='Licence commerce',
            location='Kinshasa',
            deadline='2026-12-31',
        )

    def test_high_match_cv(self):
        cv = """
        jean mutombo commercial kinshasa rdc congo
        5 ans d experience en vente et prospection b2b negociation
        licence en commerce gestion
        maitrise du crm salesforce negociation commerciale
        competences vente prospection negociation crm terrain kinshasa
        """
        result = score_application(self.job, cv.lower())
        self.assertGreaterEqual(result['final_score'], 60)
        self.assertIn(result['recommendation'], ('shortlist', 'manual_review'))

    def test_low_match_cv(self):
        cv = """
        marie kabila infirmiere
        1 an experience hopital
        diplome infirmier
        """
        result = score_application(self.job, cv.lower())
        self.assertLess(result['final_score'], 40)
        self.assertEqual(result['recommendation'], 'reject_suggested')

    def test_medium_match_cv(self):
        cv = """
        paul lumumba assistant commercial kinshasa
        2 ans experience vente detail
        graduat commerce
        """
        result = score_application(self.job, cv.lower())
        self.assertGreaterEqual(result['final_score'], 40)
        self.assertLess(result['final_score'], 85)
