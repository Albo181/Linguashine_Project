from django.db import models
from django.conf import settings


class FileType(models.TextChoices):
    DOCUMENT = 'document', "Document"
    IMAGE = 'image', "Image"
    AUDIO = 'audio', "Audio"
    VIDEO = 'video', "Video"


CustomUser = settings.AUTH_USER_MODEL


# Base PrivateFile Model
class PrivateFile(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="%(class)s_sent_files")  # Dynamically generated related_name
    title = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file_type = models.CharField(max_length=10, choices=FileType, default=FileType.DOCUMENT)

    def __str__(self):
        return self.title

    class Meta:
        abstract = True  # Defines common fields for inheritance; no database table created


# Private Document Model
class PrivateDocument(PrivateFile):
    document = models.FileField(upload_to='private_docs/')


# Private Image Model
class PrivateImage(PrivateFile):
    image = models.ImageField(upload_to='private_images/')


# Private Audio Model
class PrivateAudio(PrivateFile):
    audio = models.FileField(upload_to='private_audio/')


# Private Video Model
class PrivateVideo(PrivateFile):
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
