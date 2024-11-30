from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostModelViewset


router = DefaultRouter()
router.register("contacto", PostModelViewset)

urlpatterns = [
    path("", include(router.urls))
]
