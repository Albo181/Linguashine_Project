from django.contrib.auth.models import AbstractUser 
from django.db import models

class UserType(models.TextChoices):
    
    STUDENT = 'student', "Student"
    TEACHER = 'teacher', "Teacher"

class CustomUser(AbstractUser):
    
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    telephone = models.CharField(max_length=30, blank=True)
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    user_type = models.CharField(max_length=20, choices=UserType, default=UserType.STUDENT)
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



