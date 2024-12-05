from rest_framework import serializers
from .models import (
    PrivateDocument, PrivateImage, PrivateAudio, PrivateVideo, 
    SharedFile, Announcement
)
from Users.models import CustomUser
from Users.serializers import UserProfileSerializer  # Using UserProfileSerializer instead of UserSerializer


# Helper Function to Get Absolute URL
def get_absolute_url(request, path):
    if path:
        return request.build_absolute_uri(path)
    return None


# Base Serializer for File Models
class BaseFileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    sender = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()

    class Meta:
        fields = ['id', 'title', 'file_url', 'sender', 'type']

    def get_file_url(self, obj):
        request = self.context.get('request')
        file_field = getattr(obj, self.file_field_name, None)
        return get_absolute_url(request, file_field.url if file_field else None)
    
    def get_sender(self, obj):
        return {
            'id': obj.sender.id,
            'username': obj.sender.username,
            'first_name': obj.sender.first_name,
            'last_name': obj.sender.last_name
        } if obj.sender else None
    
    def get_type(self, obj):
        return obj.file_type


# Base Private File Serializer
class BasePrivateFileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    sender = UserProfileSerializer(read_only=True)
    user = UserProfileSerializer(read_only=True)

    def get_file_url(self, obj):
        return obj.get_file_url()

    class Meta:
        fields = ['id', 'title', 'uploaded_at', 'sender', 'user', 'file_url']
        abstract = True


# Student Serializer
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name']


# Private Document Serializer
class PrivateDocumentSerializer(BasePrivateFileSerializer):
    class Meta(BasePrivateFileSerializer.Meta):
        model = PrivateDocument


# Private Image Serializer
class PrivateImageSerializer(BasePrivateFileSerializer):
    class Meta(BasePrivateFileSerializer.Meta):
        model = PrivateImage


# Private Audio Serializer
class PrivateAudioSerializer(BasePrivateFileSerializer):
    class Meta(BasePrivateFileSerializer.Meta):
        model = PrivateAudio


# Private Video Serializer
class PrivateVideoSerializer(BasePrivateFileSerializer):
    class Meta(BasePrivateFileSerializer.Meta):
        model = PrivateVideo


# Shared File Serializer
class SharedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedFile
        fields = ['id', 'title', 'file', 'uploaded_at']

    def create(self, validated_data):
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data)


# Announcement Serializer
class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'posted_at']

    def create(self, validated_data):
        validated_data['posted_by'] = self.context['request'].user
        return super().create(validated_data)
