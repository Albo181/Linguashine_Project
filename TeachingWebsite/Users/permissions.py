import logging
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import get_object_or_404
from .models import CustomUser


logger = logging.getLogger(__name__)

class IsStudentAndLoggedIn(permissions.BasePermission):
    """
    Custom permission to allow only logged-in students to view or edit their own details.
    """

    def has_permission(self, request, view):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            logger.debug("User is not authenticated.")
            return False  # Deny access if the user is not logged in
        
        # Check if the user is a student
        if getattr(request.user, 'user_type', None) != "STUDENT":
            logger.debug(f"User is authenticated but not a student, user_type: {getattr(request.user, 'user_type', None)}")
            return False
        
        return True
    
    def has_object_permission(self, request, view, obj):
        if not isinstance(obj, CustomUser):
            return False

        return obj.username == request.user.username  # Compare usernames

