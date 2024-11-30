import logging
from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission  
from Users.models import CustomUser, UserType



logger = logging.getLogger(__name__)


class IsTeacherUser(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        print(f"User: {user}, Authenticated: {user.is_authenticated}, User type: {user.user_type}")  # Debug line

        if user.is_authenticated and user.user_type == UserType.TEACHER:
            return True

        return False
 
class IsStudentOwnerOrTeacher(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow the owner of the file (student) or a teacher to delete
        if request.user.user_type == UserType.STUDENT and request.user.id == obj.user.id:
            return True
        elif request.user.user_type == UserType.TEACHER:
            return True
        return False



class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            logger.debug("User is not authenticated.")
            raise PermissionDenied("Authentication required.")

        user_type = getattr(request.user, 'user_type', None)

        if user_type != UserType.STUDENT:
            logger.debug(f"User is authenticated but not a student. User type: {user_type}")
            raise PermissionDenied("Only students can access this resource.")

        return True
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
   
    
    
class IsStudentAndOwnPrivateFile(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            logger.debug("User is not authenticated.")
            raise PermissionDenied("Authentication required.")

        user_type = getattr(request.user, 'user_type', None)

        if user_type != UserType.STUDENT and user_type != UserType.TEACHER:
            logger.debug(f"User is authenticated but neither a student nor a teacher. User type: {user_type}")
            raise PermissionDenied("Only students and teachers can access this resource.")

        return True

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user



#SHARED FILE PERMISSION


