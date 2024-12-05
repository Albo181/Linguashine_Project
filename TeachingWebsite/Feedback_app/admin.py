from django.contrib import admin
from .models import Feedback, Annotation

# Register your models here.

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'send_to', 'task_type', 'submission_date', 'grade_percent')
    list_filter = ('task_type', 'submission_date')
    search_fields = ('student_name__username', 'send_to__username', 'student_notes', 'teacher_notes')
    date_hierarchy = 'submission_date'
    readonly_fields = ('submission_date', 'feedback_date', 'grade_percent')

    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return self.readonly_fields + ('student_name',)
        return self.readonly_fields

@admin.register(Annotation)
class AnnotationAdmin(admin.ModelAdmin):
    list_display = ('feedback', 'line_number', 'comment')
    list_filter = ('feedback',)
    search_fields = ('comment',)