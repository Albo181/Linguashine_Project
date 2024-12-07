from django.contrib.auth.models import AbstractUser 
from django.db import models
from django.conf import settings
import os

class UserType(models.TextChoices):
    STUDENT = 'student', "Student"
    TEACHER = 'teacher', "Teacher"

def user_profile_path(instance, filename):
    # Get the file extension while handling case sensitivity
    ext = os.path.splitext(filename)[1].lower()
    # Return the new path
    return f'profile_pics/user_{instance.id}/{filename}'

class CustomUser(AbstractUser):
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    email = models.EmailField(unique=True)
    telephone = models.CharField(max_length=30, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to=user_profile_path, blank=True, null=True)
    user_type = models.CharField(max_length=20, choices=UserType.choices, default=UserType.STUDENT)
    forum_access = models.BooleanField(default=False)
    receive_email_notifications = models.BooleanField(default=False)
    
    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        verbose_name = 'Custom User'
        verbose_name_plural = 'Custom Users'

    def __str__(self):
        return f"{self.username} ({self.user_type})"

    def save(self, *args, **kwargs):
        # If this is a new user (no ID yet), save first to get the ID
        if not self.id:
            super().save(*args, **kwargs)
        
        # If there's a new profile picture and an old one exists
        if self.profile_picture and hasattr(self, '_original_profile_picture'):
            if self._original_profile_picture and self._original_profile_picture != self.profile_picture:
                # Delete the old profile picture
                storage = self._original_profile_picture.storage
                if storage.exists(self._original_profile_picture.name):
                    storage.delete(self._original_profile_picture.name)
        
        super().save(*args, **kwargs)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Store the original profile picture path
        self._original_profile_picture = self.profile_picture if self.profile_picture else None
