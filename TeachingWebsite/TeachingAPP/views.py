from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication
from .serializers import PostSerializer
from .models import Post
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle

class ContactFormThrottle(AnonRateThrottle):
    rate = '5/hour'  # Limit to 10 messages per hour per IP

class PostModelViewset(ModelViewSet):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [AllowAny]
    authentication_classes = []  # No authentication required for contact form
    throttle_classes = [ContactFormThrottle]  # Add throttling

    def create(self, request, *args, **kwargs):
        print("Received data:", request.data)  # Debug incoming data
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            print("Error creating post:", str(e))  # Debug any errors
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )