from django.contrib import admin                                            #edit whole
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser

class UserAdmin(BaseUserAdmin):
    model = CustomUser
    list_display = ('username', 'role', 'is_active', 'is_staff')
    list_filter = ('is_staff', 'is_active', 'role')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions')}),
        ('Role', {'fields': ('role',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'role')}
        ),
    )
    search_fields = ('username',)
    ordering = ('username',)

admin.site.register(CustomUser, UserAdmin)