from django.contrib import admin
from .models import Feedback, Annotation, Homework, HomeworkSubmission
from django.utils.html import format_html

# Register your models here.

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'send_to', 'task_type', 'submission_date', 'grade_display', 'hidden_status', 'document_preview')
    list_filter = ('task_type', 'submission_date', 'hidden_from_student', 'hidden_from_teacher')
    search_fields = ('student_name__username', 'student_name__first_name', 'student_name__last_name',
                    'send_to__username', 'send_to__first_name', 'send_to__last_name',
                    'student_notes', 'teacher_notes')
    date_hierarchy = 'submission_date'
    readonly_fields = ('submission_date', 'feedback_date', 'grade_percent')
    actions = ['unhide_all']

    def grade_display(self, obj):
        if obj.grade_awarded is not None and obj.grade_total is not None:
            return f"{obj.grade_awarded}/{obj.grade_total} ({obj.grade_percent}%)"
        return "Not graded"
    grade_display.short_description = "Grade"

    def hidden_status(self, obj):
        status = []
        if obj.hidden_from_student:
            status.append("Hidden from student")
        if obj.hidden_from_teacher:
            status.append("Hidden from teacher")
        return ", ".join(status) if status else "Visible to both"
    hidden_status.short_description = "Visibility Status"

    def document_preview(self, obj):
        if obj.document_area:
            return format_html('<a href="{}" target="_blank">View Document</a>', obj.document_area.url)
        return "No document"
    document_preview.short_description = "Document"

    def unhide_all(self, request, queryset):
        queryset.update(hidden_from_student=False, hidden_from_teacher=False)
    unhide_all.short_description = "Unhide selected submissions"

    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return self.readonly_fields + ('student_name',)
        return self.readonly_fields

    fieldsets = (
        ('User Information', {
            'fields': ('student_name', 'send_to')
        }),
        ('Submission Details', {
            'fields': ('task_type', 'document_area', 'submission_date', 'feedback_date')
        }),
        ('Grading', {
            'fields': ('grade_awarded', 'grade_total', 'grade_percent')
        }),
        ('Notes', {
            'fields': ('student_notes', 'teacher_notes')
        }),
        ('Visibility', {
            'fields': ('hidden_from_student', 'hidden_from_teacher')
        })
    )

@admin.register(Annotation)
class AnnotationAdmin(admin.ModelAdmin):
    list_display = ('feedback', 'line_number', 'comment')
    list_filter = ('feedback',)
    search_fields = ('comment',)

@admin.register(Homework)
class HomeworkAdmin(admin.ModelAdmin):
    list_display = ('teacher', 'student', 'set_date', 'due_date', 'submitted', 'days_until_due')
    list_filter = ('submitted', 'is_sent', 'teacher', 'student')
    search_fields = ('teacher__username', 'student__username', 'instructions', 'comments')
    date_hierarchy = 'due_date'
    readonly_fields = ('created_at', 'updated_at')

@admin.register(HomeworkSubmission)
class HomeworkSubmissionAdmin(admin.ModelAdmin):
    list_display = ('homework', 'student', 'submission_date')
    list_filter = ('submission_date', 'student')
    search_fields = ('homework__instructions', 'student__username')
    date_hierarchy = 'submission_date'