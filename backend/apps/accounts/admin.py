from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import CandidateProfile, User


class CandidateProfileInline(admin.StackedInline):
    model = CandidateProfile
    extra = 0


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'phone', 'is_active')
    list_filter = ('role', 'is_active')
    search_fields = ('email', 'first_name', 'last_name', 'phone')
    ordering = ('email',)
    inlines = (CandidateProfileInline,)

    fieldsets = BaseUserAdmin.fieldsets + (
        ('SIGER', {'fields': ('role', 'phone')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('SIGER', {'fields': ('role', 'phone', 'email', 'first_name', 'last_name')}),
    )


@admin.register(CandidateProfile)
class CandidateProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'diplome', 'years_experience', 'current_position', 'updated_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'diplome')
