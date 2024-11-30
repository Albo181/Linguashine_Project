from django.contrib import admin
from .models import PrivateDocument, PrivateAudio, PrivateImage, PrivateVideo, SharedFile
# Register your models here.

admin.site.register(PrivateDocument)
admin.site.register(PrivateAudio)
admin.site.register(PrivateImage)
admin.site.register(PrivateVideo)
admin.site.register(SharedFile)
 