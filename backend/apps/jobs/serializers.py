import json

from rest_framework import serializers

from .models import Department, JobOffer

ALLOWED_IMAGE_TYPES = ('image/jpeg', 'image/png', 'image/webp')
MAX_IMAGE_SIZE = 5 * 1024 * 1024


class DepartmentSerializer(serializers.ModelSerializer):
    job_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ('id', 'name', 'description', 'job_count', 'created_at')

    def get_job_count(self, obj):
        return obj.job_offers.filter(status=JobOffer.Status.ACTIVE).count()


class JobOfferSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    application_count = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = JobOffer
        fields = (
            'id', 'department', 'department_name', 'title', 'description',
            'required_skills', 'min_experience', 'required_degree', 'location',
            'deadline', 'status', 'image_key', 'image', 'image_url',
            'application_count', 'created_at', 'updated_at',
        )
        extra_kwargs = {'image': {'write_only': True}}

    def get_application_count(self, obj):
        return obj.applications.count()

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None

    def validate_required_skills(self, value):
        if isinstance(value, str):
            try:
                return json.loads(value)
            except json.JSONDecodeError as exc:
                raise serializers.ValidationError('Format de compétences invalide.') from exc
        return value

    def validate_image(self, value):
        if value.content_type not in ALLOWED_IMAGE_TYPES:
            raise serializers.ValidationError('Image acceptée : JPEG, PNG ou WebP.')
        if value.size > MAX_IMAGE_SIZE:
            raise serializers.ValidationError('Image trop volumineuse (5 Mo max).')
        return value


class JobOfferListSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = JobOffer
        fields = (
            'id', 'department', 'department_name', 'title', 'location',
            'deadline', 'status', 'min_experience', 'required_skills',
            'image_key', 'image_url',
        )

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None
