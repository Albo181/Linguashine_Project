from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PrivateDocumentViewSet, PrivateImageViewSet, PrivateAudioViewSet, PrivateVideoViewSet,
    PrivateFileViewSet, StudentListView, SharedFileListCreateView, AnnouncementListCreateView,  
)

router = DefaultRouter()

# Individual routes for each file type
router.register(r'private/documents', PrivateDocumentViewSet, basename='private-documents')
router.register(r'private/images', PrivateImageViewSet, basename='private-images')
router.register(r'private/audio', PrivateAudioViewSet, basename='private-audio')
router.register(r'private/video', PrivateVideoViewSet, basename='private-video')

urlpatterns = [
    path('', include(router.urls)),
    path('students/list/', StudentListView.as_view(), name='student-list'),
    
    # File download endpoints
    path('private/documents/<int:pk>/download/', PrivateFileViewSet.as_view({'get': 'download_file'}), name='download_document'),
    path('private/images/<int:pk>/download/', PrivateFileViewSet.as_view({'get': 'download_file'}), name='download_image'),
    path('private/audio/<int:pk>/download/', PrivateFileViewSet.as_view({'get': 'download_file'}), name='download_audio'),
    path('private/video/<int:pk>/download/', PrivateFileViewSet.as_view({'get': 'download_file'}), name='download_video'),
    
    path('private/all-files/<str:student_id>/', PrivateFileViewSet.as_view({'get':'list', 'post': 'upload_file'})),

    path('shared-files/', SharedFileListCreateView.as_view(), name='shared-files-list-create'),
    path('shared-files/<int:pk>/', SharedFileListCreateView.as_view(), name='shared-file-detail'),
    path('shared-files/delete/<int:file_id>/', SharedFileListCreateView.as_view, name='download_shared_file'),
    
    path('announcements/', AnnouncementListCreateView.as_view(), name='announcements'),
    path('announcements/<int:pk>/', AnnouncementListCreateView.as_view(), name='announcements-detail'),
]

 
      

 
