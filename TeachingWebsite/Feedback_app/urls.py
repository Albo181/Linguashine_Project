from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AnnotationView,
    TeacherReceivedHomeworkView,
    TeacherSubmittedHomeworkView,
    StudentSubmittedHomeworkView,
    StudentReceivedHomeworkView,
    GradeSummaryViewSet,
    UpdateNotificationPreference,
    submit_homework,
    UploadView,
    TaskTypeListView,
    UserViewSet
)
from .homework_views import HomeworkViewSet

router = DefaultRouter()
router.register(r'homework', HomeworkViewSet, basename='homework')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('upload/', UploadView.as_view(), name='upload'),
    path('task-types/', TaskTypeListView.as_view(), name='task-types'),
    path('teacher/homework/received/', TeacherReceivedHomeworkView.as_view(), name='teacher-received-homework'),
    path('teacher/homework/submitted/', TeacherSubmittedHomeworkView.as_view(), name='teacher-submitted-homework'),
    path('student/homework/submitted/', StudentSubmittedHomeworkView.as_view(), name='student-submitted-homework'),
    path('student/homework/submitted/<int:pk>/', StudentSubmittedHomeworkView.as_view(), name='student-submitted-homework-detail'),
    path('student/homework/received/', StudentReceivedHomeworkView.as_view(), name='student-received-homework'),
    path('student/homework/received/<int:pk>/', StudentReceivedHomeworkView.as_view(), name='student-received-homework-detail'),
    path('notification-preference/', UpdateNotificationPreference.as_view(), name='notification-preference'),
    path('grade-summary/', GradeSummaryViewSet.as_view(), name='grade-summary'),
    path("grade-summary/<int:pk>/", GradeSummaryViewSet.as_view(), name="grade-summary-detail"),
    path('annotations/', AnnotationView.as_view(), name='annotation-api'),
    path('homework-submission/', submit_homework, name='submit-homework'),
]

urlpatterns += router.urls
