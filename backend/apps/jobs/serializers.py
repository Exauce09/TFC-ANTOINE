from rest_framework import serializers

from .models import Department, JobOffer


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

    class Meta:
        model = JobOffer
        fields = (
            'id', 'department', 'department_name', 'title', 'description',
            'required_skills', 'min_experience', 'required_degree', 'location',
            'deadline', 'status', 'image_key', 'application_count', 'created_at', 'updated_at',
        )

    def get_application_count(self, obj):
        return obj.applications.count()


class JobOfferListSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = JobOffer
        fields = (
            'id', 'department', 'department_name', 'title', 'location',
            'deadline', 'status', 'min_experience', 'required_skills', 'image_key',
        )
