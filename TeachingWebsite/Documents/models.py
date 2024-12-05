from django.db import models
from django.conf import settings


class FileType(models.TextChoices):
    DOCUMENT = 'document', "Document"
    IMAGE = 'image', "Image"
    AUDIO = 'audio', "Audio"
    VIDEO = 'video', "Video"


CustomUser = settings.AUTH_USER_MODEL


# Base PrivateFile Model
class BasePrivateFile(models.Model):
    title = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='%(class)s_sender')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='%(class)s_user')
    file_type = models.CharField(max_length=10, choices=FileType, default=FileType.DOCUMENT)

    class Meta:
        abstract = True  # Defines common fields for inheritance; no database table created

    def get_file_url(self):
        if hasattr(self, 'document'):
            return self.document.url if self.document else None
        elif hasattr(self, 'image'):
            return self.image.url if self.image else None
        elif hasattr(self, 'audio'):
            return self.audio.url if self.audio else None
        elif hasattr(self, 'video'):
            return self.video.url if self.video else None
        return None

    def __str__(self):
        return self.title


# Private Document Model
class PrivateDocument(BasePrivateFile):
    document = models.FileField(upload_to='private_docs/')


# Private Image Model
class PrivateImage(BasePrivateFile):
    image = models.ImageField(upload_to='private_images/')


# Private Audio Model
class PrivateAudio(BasePrivateFile):
    audio = models.FileField(upload_to='private_audio/')


# Private Video Model
class PrivateVideo(BasePrivateFile):
    video = models.FileField(upload_to='private_videos/')


# Shared File Model
class SharedFile(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='shared_files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


# Announcement Model
class Announcement(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    posted_at = models.DateTimeField(auto_now_add=True)
    posted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
