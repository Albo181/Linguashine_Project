from rest_framework import serializers
from .models import (
    PrivateDocument, PrivateImage, PrivateAudio, PrivateVideo, 
    SharedFile, Announcement
)
from Users.models import CustomUser


# Helper Function to Get Absolute URL
def get_absolute_url(request, path):
    if path:
        return request.build_absolute_uri(path)
    return None


# Base Serializer for File Models
class BaseFileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        fields = ['id', 'title', 'file_url']

    def get_file_url(self, obj):
        request = self.context.get('request')
        file_field = getattr(obj, self.file_field_name, None)
        return get_absolute_url(request, file_field.url if file_field else None)


# Student Serializer
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name']


# Private Document Serializer
class PrivateDocumentSerializer(BaseFileSerializer):
    file_field_name = 'document'

    class Meta(BaseFileSerializer.Meta):
        model = PrivateDocument
        fields = BaseFileSerializer.Meta.fields


# Private Image Serializer
class PrivateImageSerializer(BaseFileSerializer):
    file_field_name = 'image'

    class Meta(BaseFileSerializer.Meta):
        model = PrivateImage
        fields = BaseFileSerializer.Meta.fields


# Private Audio Serializer
class PrivateAudioSerializer(BaseFileSerializer):
    file_field_name = 'audio'

    class Meta(BaseFileSerializer.Meta):
        model = PrivateAudio
        fields = BaseFileSerializer.Meta.fields


# Private Video Serializer
class PrivateVideoSerializer(BaseFileSerializer):
    file_field_name = 'video'

    class Meta(BaseFileSerializer.Meta):
        model = PrivateVideo
        fields = BaseFileSerializer.Meta.fields


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
