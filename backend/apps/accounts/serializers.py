import json

from rest_framework import serializers

from .models import CandidateProfile, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'phone', 'role', 'created_at')
        read_only_fields = ('id', 'email', 'role', 'created_at')


class ProfileUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'phone', 'password')

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class CandidateProfileSerializer(serializers.ModelSerializer):
    profile_complete = serializers.BooleanField(read_only=True)
    cv_file_name = serializers.SerializerMethodField()

    class Meta:
        model = CandidateProfile
        fields = (
            'diplome', 'field_of_study', 'years_experience', 'current_position',
            'linkedin', 'bio', 'cv_file', 'cv_file_name', 'skills',
            'profile_complete', 'updated_at',
        )
        read_only_fields = ('updated_at', 'profile_complete', 'cv_file_name')

    def get_cv_file_name(self, obj):
        if obj.cv_file:
            return obj.cv_file.name.split('/')[-1]
        return None


class CandidateProfileUpdateSerializer(serializers.ModelSerializer):
    skills = serializers.JSONField(required=False)
    remove_cv = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = CandidateProfile
        fields = (
            'diplome', 'field_of_study', 'years_experience', 'current_position',
            'linkedin', 'bio', 'cv_file', 'skills', 'remove_cv',
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

    def validate_skills(self, value):
        if isinstance(value, str):
            try:
                value = json.loads(value)
            except json.JSONDecodeError:
                value = [s.strip() for s in value.split(',') if s.strip()]
        if not isinstance(value, list):
            raise serializers.ValidationError('Les compétences doivent être une liste.')
        return value

    def update(self, instance, validated_data):
        if validated_data.pop('remove_cv', False):
            if instance.cv_file:
                instance.cv_file.delete(save=False)
            instance.cv_file = None
        return super().update(instance, validated_data)


class FullCandidateProfileSerializer(serializers.Serializer):
    user = UserSerializer(read_only=True)
    profile = CandidateProfileSerializer(read_only=True)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name', 'phone', 'password', 'password_confirm')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Les mots de passe ne correspondent pas.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data, role=User.Role.CANDIDAT)
        user.set_password(password)
        user.save()
        CandidateProfile.objects.create(user=user)
        return user
