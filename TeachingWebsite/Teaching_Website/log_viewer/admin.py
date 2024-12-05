from django.contrib import admin
from django.utils.html import format_html
from .models import APILog
import json
from django.core.paginator import Paginator
from django.core.cache import cache
from django.contrib.admin.views.main import ChangeList

class APILogAdmin(admin.ModelAdmin):
    list_display = ('colored_status', 'timestamp', 'method', 'path', 'duration', 'user', 'ip_address')
    list_filter = ('method', 'status_code', 'user')
    search_fields = ('path', 'user', 'ip_address')
    readonly_fields = ('timestamp', 'method', 'path', 'status_code', 'duration', 'user', 'ip_address')
    date_hierarchy = 'timestamp'

    def colored_status(self, obj):
        if obj.status_code >= 500:
            color = 'red'
        elif obj.status_code >= 400:
            color = 'orange'
        else:
            color = 'green'
        return format_html(
            '<span style="color: {};">{}</span>',
            color,
            obj.status_code
        )
    colored_status.short_description = 'Status'

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        # Add summary statistics to the change list view
        response = super().changelist_view(request, extra_context)
        try:
            qs = response.context_data['cl'].queryset
        except (AttributeError, KeyError):
            return response

        # Add summary stats
        response.context_data['total_requests'] = qs.count()
        response.context_data['error_requests'] = qs.filter(status_code__gte=400).count()
        response.context_data['unique_users'] = qs.values('user').distinct().count()
        
        return response

    class Media:
        css = {
            'all': ('admin/css/log_viewer.css',)
        }

admin.site.register(APILog, APILogAdmin)
