from django.contrib import admin

from .models import NotificationLog


@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = ('application', 'channel', 'recipient', 'template_name', 'status', 'sent_at')
    list_filter = ('channel', 'status', 'template_name')
