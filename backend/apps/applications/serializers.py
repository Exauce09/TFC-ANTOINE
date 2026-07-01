import json
import os

from django.core.files import File
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
            'job_offer', 'job_title', 'cv_file', 'cover_letter', 'motivation_answers',
            'availability_date', 'status',
            'auto_score', 'final_score', 'display_score', 'score_details',
            'score_recommendation', 'consent_given', 'interview_date',
            'interview_location', 'interview_contact', 'created_at', 'updated_at',
        )
        read_only_fields = (
            'candidate', 'auto_score', 'score_details', 'cv_text', 'created_at', 'updated_at',
        )


class ApplicationCreateSerializer(serializers.ModelSerializer):
    use_profile_cv = serializers.BooleanField(required=False, default=False)
    motivation_answers = serializers.JSONField(required=False)

    class Meta:
        model = Application
        fields = (
            'job_offer', 'cv_file', 'cover_letter', 'consent_given',
            'use_profile_cv', 'motivation_answers', 'availability_date',
        )

    def validate_cv_file(self, value):
        if not value:
            return value
        name = value.name.lower()
        if not (name.endswith('.pdf') or name.endswith('.docx') or name.endswith('.doc')):
            raise serializers.ValidationError('Format accepté : PDF ou DOCX (max 5 Mo).')
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError('Le fichier ne doit pas dépasser 5 Mo.')
        return value

    def validate_motivation_answers(self, value):
        if isinstance(value, str):
            try:
                value = json.loads(value)
            except json.JSONDecodeError:
                raise serializers.ValidationError('Format JSON invalide pour les réponses.')
        if value is not None and not isinstance(value, dict):
            raise serializers.ValidationError('Les réponses doivent être un objet JSON.')
        return value or {}

    def validate_consent_given(self, value):
        if not value:
            raise serializers.ValidationError('Vous devez accepter le traitement de vos données.')
        return value

    def validate(self, attrs):
        use_profile = attrs.get('use_profile_cv', False)
        cv_file = attrs.get('cv_file')
        if not cv_file and not use_profile:
            raise serializers.ValidationError({
                'cv_file': 'Veuillez joindre un CV ou utiliser celui de votre profil.',
            })
        if use_profile:
            user = self.context['request'].user
            profile = getattr(user, 'candidate_profile', None)
            if not profile or not profile.cv_file:
                raise serializers.ValidationError({
                    'use_profile_cv': 'Aucun CV enregistré sur votre profil. Complétez votre profil ou joignez un fichier.',
                })
        return attrs

    def create(self, validated_data):
        use_profile = validated_data.pop('use_profile_cv', False)
        user = self.context['request'].user

        if use_profile and not validated_data.get('cv_file'):
            profile = user.candidate_profile
            profile_cv = profile.cv_file
            validated_data['cv_file'] = File(
                profile_cv.open('rb'),
                name=os.path.basename(profile_cv.name),
            )

        return Application.objects.create(candidate=user, **validated_data)


class ApplicationStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Application.Status.choices)
    final_score = serializers.FloatField(required=False, min_value=0, max_value=100)
    interview_date = serializers.DateTimeField(required=False, allow_null=True)
    interview_location = serializers.CharField(required=False, allow_blank=True)
    interview_contact = serializers.CharField(required=False, allow_blank=True)
