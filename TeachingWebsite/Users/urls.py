from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (StudentProfileView, CustomLoginView, CustomLogoutView, 
                    get_csrf_token, session_id_check, CurrentUserView, 
                    CheckAuthView, AllUsersProfileView, UserInfoView, test_db_connection,
                    test_cors)

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
    path('user-info/', UserInfoView.as_view(), name='user-info'),
    path('api/test-db/', test_db_connection, name='test_db_connection'),
    path('test-cors/', test_cors, name='test_cors'),  # New test endpoint
    path("", include(router.urls)),  # This will include /users/profile endpoint
]
