from rest_framework import serializers

from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(source='candidate.get_full_name', read_only=True)
    candidate_email = serializers.CharField(source='candidate.email', read_only=True)
    candidate_phone = serializers.CharField(source='candidate.phone', read_only=True)
    job_title = serializers.CharField(source='job_offer.title', read_only=True)
    display_score = serializers.FloatField(read_only=True)
    score_recommendation = serializers.CharField(read_only=True)

    class Meta:
        model = Application
        fields = (
            'id', 'candidate', 'candidate_name', 'candidate_email', 'candidate_phone',
            'job_offer', 'job_title', 'cv_file', 'cover_letter', 'status',
            'auto_score', 'final_score', 'display_score', 'score_details',
            'score_recommendation', 'consent_given', 'interview_date',
            'interview_location', 'interview_contact', 'created_at', 'updated_at',
        )
        read_only_fields = (
            'candidate', 'auto_score', 'score_details', 'cv_text', 'created_at', 'updated_at',
        )


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ('job_offer', 'cv_file', 'cover_letter', 'consent_given')

    def validate_cv_file(self, value):
        name = value.name.lower()
        if not (name.endswith('.pdf') or name.endswith('.docx') or name.endswith('.doc')):
            raise serializers.ValidationError('Format accepté : PDF ou DOCX (max 5 Mo).')
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError('Le fichier ne doit pas dépasser 5 Mo.')
        return value

    def validate_consent_given(self, value):
        if not value:
            raise serializers.ValidationError('Vous devez accepter le traitement de vos données.')
        return value


class ApplicationStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Application.Status.choices)
    final_score = serializers.FloatField(required=False, min_value=0, max_value=100)
    interview_date = serializers.DateTimeField(required=False, allow_null=True)
    interview_location = serializers.CharField(required=False, allow_blank=True)
    interview_contact = serializers.CharField(required=False, allow_blank=True)
