from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission
from Users.models import CustomUser, UserType


class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise PermissionDenied("Authentication required.")

        if request.user.user_type != 'student':  
            raise PermissionDenied("Only students can access this resource.")
        
        return True

    def has_object_permission(self, request, view, obj):
        return obj.student_name == request.user  # Ensure the user owns the object

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise PermissionDenied("Authentication required.")

        if request.user.user_type != 'teacher':  
            raise PermissionDenied("Only teachers can access this resource.")
        
        return True
    
    def has_object_permission(self, request, view, obj):
        return obj.send_to == request.user  # Teachers access specific objects
