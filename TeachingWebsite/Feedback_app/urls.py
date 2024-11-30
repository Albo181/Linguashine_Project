from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (AnnotationView, UserViewSet, 
                    TeacherUploadView, StudentUploadView, TaskTypeListView,
                    TeacherReceivedHomeworkView, TeacherSubmittedHomeworkView,
                    StudentSubmittedHomeworkView, StudentReceivedHomeworkView,
                    GradeSummaryViewSet, UpdateNotificationPreference)

router = DefaultRouter()

#router.register(r'feedback', FeedbackViewSet, basename='feedback') #PROBABLY NOT NECESSARY NOW
#router.register(r'annotations', AnnotationView, basename='annotation')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
   
      # Teacher views
    path('teacher-upload/', TeacherUploadView.as_view(), name='teacher_upload'),
    path('teacher-homework-received/', TeacherReceivedHomeworkView.as_view(), name='teacher_homework_received'),
    path('teacher-homework-submitted/', TeacherSubmittedHomeworkView.as_view(), name='teacher_homework_submitted'),
    
    # Student views
    path('student-upload/', StudentUploadView.as_view(), name='student_upload'),
    path('student-homework-submitted/', StudentSubmittedHomeworkView.as_view(), name='student_homework_submitted'),
    path('student-homework-received/', StudentReceivedHomeworkView.as_view(), name='student_homework_received'),
    path('student-notification-preference/', UpdateNotificationPreference.as_view(), name='update_notification_preference'),  
    
    path('task-types/', TaskTypeListView.as_view(), name='task-types'),
    
    path("grade-summary/", GradeSummaryViewSet.as_view(), name="feedback-list"),
    path("grade-summary/<int:pk>/", GradeSummaryViewSet.as_view(), name="feedback-detail"),
    
    path('annotations/', AnnotationView.as_view(), name='annotation-api'),
  
   
]
 
