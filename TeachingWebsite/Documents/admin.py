from django.contrib import admin
from django.core.exceptions import ValidationError
from django.utils.html import format_html
from django.template.defaultfilters import filesizeformat
from .models import PrivateDocument, PrivateAudio, PrivateImage, PrivateVideo, SharedFile, Announcement
import os
import mimetypes

# Maximum file sizes (in bytes)
MAX_DOCUMENT_SIZE = 50 * 1024 * 1024  # 50MB
MAX_IMAGE_SIZE = 10 * 1024 * 1024     # 10MB
MAX_AUDIO_SIZE = 30 * 1024 * 1024     # 30MB
MAX_VIDEO_SIZE = 100 * 1024 * 1024    # 100MB

# Allowed file types (file extensions)
ALLOWED_DOCUMENT_TYPES = ['.pdf', '.doc', '.docx', '.txt']
ALLOWED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.gif']
ALLOWED_AUDIO_TYPES = ['.mp3', '.wav', '.ogg']
ALLOWED_VIDEO_TYPES = ['.mp4', '.mpeg', '.mov']

class BasePrivateFileAdmin(admin.ModelAdmin):
    list_display = ('title', 'sender', 'user', 'uploaded_at', 'file_type', 'file_size_display', 'file_type_display')
    list_filter = ('file_type', 'uploaded_at', 'sender', 'user')
    search_fields = ('title', 'sender__username', 'user__username')
    date_hierarchy = 'uploaded_at'
    readonly_fields = ('uploaded_at', 'file_size_display', 'file_type_display')

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing existing object
            return self.readonly_fields + ('file_type',)
        return self.readonly_fields

    def file_size_display(self, obj):
        file_field = self.get_file_field(obj)
        if file_field and hasattr(file_field, 'size'):
            return filesizeformat(file_field.size)
        return "N/A"
    file_size_display.short_description = 'File Size'

    def file_type_display(self, obj):
        file_field = self.get_file_field(obj)
        if file_field and hasattr(file_field, 'path'):
            mime_type, _ = mimetypes.guess_type(file_field.path)
            return mime_type or "Unknown"
        return "N/A"
    file_type_display.short_description = 'File Type'

    def get_file_field(self, obj):
        if hasattr(obj, 'document'):
            return obj.document
        elif hasattr(obj, 'audio'):
            return obj.audio
        elif hasattr(obj, 'image'):
            return obj.image
        elif hasattr(obj, 'video'):
            return obj.video
        return None

    def clean_file(self, file_field, allowed_types, max_size, file_type_name):
        if not file_field:
            return

        # Check file size
        if file_field.size > max_size:
            raise ValidationError(
                f'{file_type_name} file too large. Size should not exceed {filesizeformat(max_size)}.'
            )

        # Check file extension
        file_ext = os.path.splitext(file_field.name)[1].lower()
        if file_ext not in allowed_types:
            raise ValidationError(
                f'Unsupported file type. Allowed types for {file_type_name}: {", ".join(allowed_types)}'
            )

    def delete_model(self, request, obj):
        file_field = self.get_file_field(obj)
        if file_field:
            try:
                file_path = file_field.path
                if os.path.exists(file_path):
                    os.remove(file_path)
            except Exception as e:
                self.message_user(request, f"Error deleting file: {str(e)}", level='ERROR')
        obj.delete()

    def delete_queryset(self, request, queryset):
        for obj in queryset:
            self.delete_model(request, obj)

@admin.register(PrivateDocument)
class PrivateDocumentAdmin(BasePrivateFileAdmin):
    def clean(self, request, obj):
        super().clean(request, obj)
        if obj.document:
            self.clean_file(obj.document, ALLOWED_DOCUMENT_TYPES, MAX_DOCUMENT_SIZE, 'Document')

@admin.register(PrivateAudio)
class PrivateAudioAdmin(BasePrivateFileAdmin):
    def clean(self, request, obj):
        super().clean(request, obj)
        if obj.audio:
            self.clean_file(obj.audio, ALLOWED_AUDIO_TYPES, MAX_AUDIO_SIZE, 'Audio')

@admin.register(PrivateImage)
class PrivateImageAdmin(BasePrivateFileAdmin):
    def clean(self, request, obj):
        super().clean(request, obj)
        if obj.image:
            self.clean_file(obj.image, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, 'Image')

@admin.register(PrivateVideo)
class PrivateVideoAdmin(BasePrivateFileAdmin):
    def clean(self, request, obj):
        super().clean(request, obj)
        if obj.video:
            self.clean_file(obj.video, ALLOWED_VIDEO_TYPES, MAX_VIDEO_SIZE, 'Video')

@admin.register(SharedFile)
class SharedFileAdmin(admin.ModelAdmin):
    list_display = ('title', 'uploaded_by', 'uploaded_at', 'file_size_display', 'file_type_display')
    list_filter = ('uploaded_at', 'uploaded_by')
    search_fields = ('title', 'uploaded_by__username')
    date_hierarchy = 'uploaded_at'
    readonly_fields = ('uploaded_at', 'file_size_display', 'file_type_display')

    def file_size_display(self, obj):
        if obj.file:
            return filesizeformat(obj.file.size)
        return "N/A"
    file_size_display.short_description = 'File Size'

    def file_type_display(self, obj):
        if obj.file:
            mime_type, _ = mimetypes.guess_type(obj.file.path)
            return mime_type or "Unknown"
        return "N/A"
    file_type_display.short_description = 'File Type'

    def delete_model(self, request, obj):
        if obj.file:
            try:
                file_path = obj.file.path
                if os.path.exists(file_path):
                    os.remove(file_path)
            except Exception as e:
                self.message_user(request, f"Error deleting file: {str(e)}", level='ERROR')
        obj.delete()

    def delete_queryset(self, request, queryset):
        for obj in queryset:
            self.delete_model(request, obj)

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title', 'posted_by', 'posted_at')
    list_filter = ('posted_at', 'posted_by')
    search_fields = ('title', 'content', 'posted_by__username')
    date_hierarchy = 'posted_at'
    readonly_fields = ('posted_at',)