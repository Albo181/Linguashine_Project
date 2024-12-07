from rest_framework import serializers
from .models import CustomUser
from django.conf import settings
from django.templatetags.static import static

#Access to ALL students' profiles (object list)
class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'telephone', 'bio', 'profile_picture', 'profile_picture_url', 'user_type']
        extra_kwargs = {
            'profile_picture': {'write_only': True, 'required': False}
        }

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.profile_picture.url)
            return settings.MEDIA_URL + str(obj.profile_picture)
        return None


class StudentAccessSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'telephone', 'bio', 'profile_picture', 'profile_picture_url', 'user_type', 'forum_access']
        read_only_fields = ['id', 'username', 'email', 'user_type', 'forum_access']
        extra_kwargs = {
            'profile_picture': {'write_only': True, 'required': False}
        }

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.profile_picture.url)
            return settings.MEDIA_URL + str(obj.profile_picture)
        return None