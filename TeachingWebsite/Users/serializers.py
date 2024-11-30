from rest_framework import serializers
from .models import CustomUser
from django.conf import settings
from django.templatetags.static import static

#Access to ALL students' profiles (object list)
class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)  # Include the profile picture

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'telephone', 'bio', 'profile_picture', 'user_type']


class StudentAccessSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'telephone', 'bio', 'profile_picture', 'user_type', 'forum_access']
        read_only_fields = ['id', 'username', 'email', 'user_type', 'forum_access']

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            # Ensure that the full URL is being returned, including the media URL
            return settings.MEDIA_URL + obj.profile_picture.url
        return settings.STATIC_URL + 'Mascota.png'  # Fallback to static image if no profile picture is set