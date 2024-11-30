# Documents/aggregate_serializers.py
from rest_framework import serializers
from .models import PrivateDocument, PrivateImage, PrivateAudio, PrivateVideo

# Serializer for all private files
class PrivateAllFilesSerializer(serializers.Serializer):
    private_documents = serializers.SerializerMethodField()
    private_images = serializers.SerializerMethodField()
    private_audio = serializers.SerializerMethodField()
    private_videos = serializers.SerializerMethodField()

    def get_private_documents(self, obj):
        return PrivateDocument.objects.values('id', 'title', 'uploaded_at', 'document')

    def get_private_images(self, obj):
        return PrivateImage.objects.values('id', 'title', 'uploaded_at', 'image')

    def get_private_audio(self, obj):
        return PrivateAudio.objects.values('id', 'title', 'uploaded_at', 'audio')

    def get_private_videos(self, obj):
        return PrivateVideo.objects.values('id', 'title', 'uploaded_at', 'video')


# Serializer for all shared files
