# Documents/base_serializers.py
from rest_framework import serializers

class BaseDocumentSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    
    sender = serializers.StringRelatedField()
    
    def get_url(self, obj):
        request = self.context.get('request')
        file_field = getattr(obj, self.file_field_name)
        return request.build_absolute_uri(file_field.url) if request else file_field.url
    
    class Meta:
            fields = ['id', 'title', 'sender', 'url', 'uploaded_at']  # Include sender in shared fields