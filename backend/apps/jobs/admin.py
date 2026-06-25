from django.contrib import admin

from .models import Department, JobOffer


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)


@admin.register(JobOffer)
class JobOfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'department', 'status', 'deadline', 'location')
    list_filter = ('status', 'department', 'location')
    search_fields = ('title', 'description')
