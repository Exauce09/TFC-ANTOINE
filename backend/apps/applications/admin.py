from django.contrib import admin

from .models import Application, AuditLog


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('candidate', 'job_offer', 'status', 'auto_score', 'final_score', 'created_at')
    list_filter = ('status', 'job_offer')
    search_fields = ('candidate__email', 'candidate__first_name', 'candidate__last_name')


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('application', 'user', 'action', 'created_at')
    list_filter = ('action',)
