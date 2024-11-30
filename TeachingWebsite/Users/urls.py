from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (StudentProfileView, CustomLoginView, CustomLogoutView, 
                    get_csrf_token, session_id_check, CurrentUserView, 
                    CheckAuthView, AllUsersProfileView)

router = DefaultRouter()
 

urlpatterns = [
    path("login/", CustomLoginView.as_view(), name='login'),
    path("logout/", CustomLogoutView.as_view(), name='logout'),
    path("check-auth/", CheckAuthView.as_view(), name='check_auth'),
    path("me/", CurrentUserView.as_view(), name='current_user'),
    path("profile/", StudentProfileView.as_view(), name='student-profile'),
    path("session_id/", session_id_check, name='logout'),
    path("api/get-csrf-token/", get_csrf_token, name='get_csrf_token'),
    path('all-users/', AllUsersProfileView.as_view(), name='all-users-profiles'),
    path("", include(router.urls)),  # This will include /users/profile endpoint
]
