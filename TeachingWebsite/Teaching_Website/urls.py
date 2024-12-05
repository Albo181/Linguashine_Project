"""
URL configuration for Teaching_Website project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "ok", "message": "API is running"})

# Create the router and register your viewsets
router = DefaultRouter()


urlpatterns = [
    path('', health_check, name='health_check'),  # Add root URL handler
    path('admin/', admin.site.urls),
    path('api/', include("Feedback_app.urls")),  # Include API routes under the `/api` prefix
    path('send_query/', include("TeachingAPP.urls")),
    path('users/', include("Users.urls")),
    path('files/', include('Documents.urls')),
    
    # Add alternative path for user-info to maintain compatibility
    path('api/user-info/', include("Users.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
