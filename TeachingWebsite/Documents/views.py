from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from .models import FileType, PrivateDocument, PrivateImage, PrivateAudio, PrivateVideo
from .serializers import (
    PrivateDocumentSerializer, PrivateImageSerializer, PrivateAudioSerializer, PrivateVideoSerializer,
    StudentSerializer
)
from Users.models import CustomUser, UserType
from .permissions import IsStudentAndOwnPrivateFile, IsTeacherUser, IsStudentOwnerOrTeacher
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.http import HttpResponse, JsonResponse, Http404
import mimetypes, os
from django.utils.encoding import smart_str
import logging

logger = logging.getLogger(__name__)

# **Teacher gets full visual students' list**
class StudentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = self.get_queryset()
        serializer = StudentSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def get_queryset(self):
        user = self.request.user
        if user.user_type == UserType.TEACHER:
            return CustomUser.objects.filter(Q(user_type=UserType.STUDENT) | Q(user_type=UserType.TEACHER))
        elif user.user_type == UserType.STUDENT:
            return CustomUser.objects.filter(pk=user.id)
        return CustomUser.objects.none()


# **Private File Views**
class PrivateFileViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsStudentOwnerOrTeacher]
    parser_classes = [MultiPartParser]

    def list(self, request, student_id=None):
        search_term = request.query_params.get('q', None)
        student = get_object_or_404(CustomUser, id=student_id) if student_id else None

        # Check permissions
        if request.user.user_type != UserType.TEACHER and request.user != student:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        documents = PrivateDocument.objects.filter(user=student) if student else PrivateDocument.objects.none()
        images = PrivateImage.objects.filter(user=student) if student else PrivateImage.objects.none()
        audios = PrivateAudio.objects.filter(user=student) if student else PrivateAudio.objects.none()
        videos = PrivateVideo.objects.filter(user=student) if student else PrivateVideo.objects.none()

        if search_term:
            documents = documents.filter(title__icontains=search_term)
            images = images.filter(title__icontains=search_term)
            audios = audios.filter(title__icontains=search_term)
            videos = videos.filter(title__icontains=search_term)

        return Response({
            'private_documents': PrivateDocumentSerializer(documents, many=True, context={'request': request}).data,
            'private_images': PrivateImageSerializer(images, many=True, context={'request': request}).data,
            'private_audio': PrivateAudioSerializer(audios, many=True, context={'request': request}).data,
            'private_videos': PrivateVideoSerializer(videos, many=True, context={'request': request}).data,
        })

    def retrieve(self, request, pk=None):
        file = (PrivateDocument.objects.filter(id=pk).first() or
                PrivateImage.objects.filter(id=pk).first() or
                PrivateAudio.objects.filter(id=pk).first() or
                PrivateVideo.objects.filter(id=pk).first())

        if not file:
            return Response("File not found", status=status.HTTP_404_NOT_FOUND)

        # Check permissions
        if request.user.user_type != UserType.TEACHER and request.user != file.user:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        serializer_class = (PrivateDocumentSerializer if isinstance(file, PrivateDocument) else
                            PrivateImageSerializer if isinstance(file, PrivateImage) else
                            PrivateAudioSerializer if isinstance(file, PrivateAudio) else
                            PrivateVideoSerializer)

        serializer = serializer_class(file, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['delete'], detail=False, url_path='delete/(?P<file_type>[a-z]+)/(?P<file_id>[0-9]+)')
    def delete_file(self, request, file_type, file_id):
        try:
            if file_type == 'document':
                file = get_object_or_404(PrivateDocument, id=file_id)
            elif file_type == 'image':
                file = get_object_or_404(PrivateImage, id=file_id)
            elif file_type == 'audio':
                file = get_object_or_404(PrivateAudio, id=file_id)
            elif file_type == 'video':
                file = get_object_or_404(PrivateVideo, id=file_id)
            else:
                return JsonResponse({"error": "Invalid file type"}, status=status.HTTP_400_BAD_REQUEST)

            file.delete()
            return JsonResponse({"message": "File deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"Error deleting file: {str(e)}")
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



    def get_file_type_from_mime(self, file_obj):
        """Helper method to determine file type from MIME type and extension"""
        extension = os.path.splitext(file_obj.name)[1].lower()
        
        # Register common MIME types
        mimetypes.add_type('video/mp4', '.mp4')
        mimetypes.add_type('video/webm', '.webm')
        mimetypes.add_type('video/quicktime', '.mov')
        mimetypes.add_type('video/x-matroska', '.mkv')
        mimetypes.add_type('audio/mpeg', '.mp3')
        mimetypes.add_type('audio/wav', '.wav')
        mimetypes.add_type('audio/aac', '.aac')
        mimetypes.add_type('audio/ogg', '.ogg')
        
        mime_type, _ = mimetypes.guess_type(file_obj.name)
        logger.info(f"Detected MIME type: {mime_type}, Extension: {extension}")
        
        # Audio types
        if (mime_type and mime_type.startswith('audio/')) or extension in ['.mp3', '.wav', '.ogg', '.aac', '.m4a']:
            return 'audio'
        
        # Video types
        elif (mime_type and mime_type.startswith('video/')) or extension in ['.mp4', '.webm', '.avi', '.mov', '.mkv']:
            return 'video'
        
        # Image types
        elif (mime_type and mime_type.startswith('image/')) or extension in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
            return 'image'
        
        # Default to document
        else:
            return 'document'

    def upload_file(self, request, student_id=None):
        try:
            file_obj = request.FILES.get('file')
            if not file_obj:
                return JsonResponse({'error': 'No file provided'}, status=400)

            title = request.POST.get('title', '')
            if not title:
                return JsonResponse({'error': 'No title provided'}, status=400)

            # Get file type from request or detect it
            file_type = request.POST.get('fileType') or self.get_file_type_from_mime(file_obj)
            logger.info(f"File type for upload: {file_type}")

            # Create the appropriate model instance based on file type
            if file_type == 'document':
                file_instance = PrivateDocument(title=title, document=file_obj)
            elif file_type == 'image':
                file_instance = PrivateImage(title=title, image=file_obj)
            elif file_type == 'audio':
                file_instance = PrivateAudio(title=title, audio=file_obj)
            elif file_type == 'video':
                file_instance = PrivateVideo(title=title, video=file_obj)
            else:
                return JsonResponse({'error': f'Invalid file type: {file_type}'}, status=400)

            # Set additional fields
            file_instance.sender = request.user
            if student_id and student_id != 'default':
                try:
                    student = CustomUser.objects.get(id=student_id)
                    file_instance.user = student
                except CustomUser.DoesNotExist:
                    return JsonResponse({'error': f'Student with id {student_id} not found'}, status=404)

            file_instance.save()
            logger.info(f"File saved successfully: {file_instance.id}")

            # Return file info in response
            return JsonResponse({
                'id': file_instance.id,
                'title': file_instance.title,
                'file_url': file_instance.get_file_url(),
                'sender': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name
                }
            })

        except Exception as e:
            logger.error(f"Error uploading file: {str(e)}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)



    def download_file(self, request, pk=None):
        try:
            logger.info(f"Starting download for file ID: {pk}")
            
            file_obj = (PrivateDocument.objects.filter(id=pk).first() or
                        PrivateImage.objects.filter(id=pk).first() or
                        PrivateAudio.objects.filter(id=pk).first() or
                        PrivateVideo.objects.filter(id=pk).first())

            if not file_obj:
                logger.error(f"File not found for ID: {pk}")
                return HttpResponse("File not found", status=404)

            # Check permissions
            if request.user.user_type != UserType.TEACHER and request.user != file_obj.user:
                logger.warning(f"Permission denied for user {request.user} accessing file {pk}")
                return HttpResponse("Permission denied", status=403)

            # Get the actual file field based on type
            if isinstance(file_obj, PrivateDocument):
                file_field = file_obj.document
                default_content_type = 'application/pdf'
            elif isinstance(file_obj, PrivateImage):
                file_field = file_obj.image
                default_content_type = 'image/jpeg'
            elif isinstance(file_obj, PrivateAudio):
                file_field = file_obj.audio
                default_content_type = 'audio/mpeg'
            elif isinstance(file_obj, PrivateVideo):
                file_field = file_obj.video
                default_content_type = 'video/mp4'
            else:
                logger.error(f"Invalid file type for file {pk}")
                return HttpResponse("Invalid file type", status=400)

            # Get file name and extension
            file_name = os.path.basename(file_field.name)
            file_extension = os.path.splitext(file_name)[1].lower()
            
            # Determine content type
            content_type = mimetypes.guess_type(file_name)[0] or default_content_type

            # Create response with file
            response = HttpResponse(content_type=content_type)
            response['Content-Disposition'] = f'attachment; filename="{smart_str(file_obj.title)}{file_extension}"'

            # Stream the file
            file_data = file_field.read()
            response.write(file_data)

            return response

        except Exception as e:
            logger.error(f"Error downloading file: {str(e)}", exc_info=True)
            return HttpResponse(f"Error downloading file: {str(e)}", status=500)

## PRIVATE INDIVIDUAL FILE-TYPE VIEWSETS -------------------------------------------------------------

class PrivateDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = PrivateDocumentSerializer
    permission_classes = [IsAuthenticated, IsStudentOwnerOrTeacher]

    def get_queryset(self):
        user_type = self.request.user.user_type
        if user_type == UserType.TEACHER:
            return PrivateDocument.objects.all()
        else:
            return PrivateDocument.objects.filter(user=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        # Get the video instance and check permissions
        instance = self.get_object()
        self.check_object_permissions(request, instance)  # Ensure permission check
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PrivateImageViewSet(viewsets.ModelViewSet):
    serializer_class = PrivateImageSerializer
    permission_classes = [IsAuthenticated, IsStudentOwnerOrTeacher]
    parser_classes = [MultiPartParser]

    def get_queryset(self):
        user_type = self.request.user.user_type
        if user_type == UserType.TEACHER:
            return PrivateImage.objects.all()
        else:
            return PrivateImage.objects.filter(user=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        # Get the video instance and check permissions
        instance = self.get_object()
        self.check_object_permissions(request, instance)  # Ensure permission check
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class PrivateAudioViewSet(viewsets.ModelViewSet):
    serializer_class = PrivateAudioSerializer
    permission_classes = [IsAuthenticated, IsStudentOwnerOrTeacher]
    parser_classes = [MultiPartParser]

    def get_queryset(self):
        user_type = self.request.user.user_type
        if user_type == UserType.TEACHER:
            return PrivateAudio.objects.all()
        else:
            return PrivateAudio.objects.filter(user=self.request.user)
        
    def destroy(self, request, *args, **kwargs):
        # Get the video instance and check permissions
        instance = self.get_object()
        self.check_object_permissions(request, instance)  # Ensure permission check
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    
class PrivateVideoViewSet(viewsets.ModelViewSet):
    serializer_class = PrivateVideoSerializer
    permission_classes = [IsAuthenticated, IsStudentOwnerOrTeacher]
    parser_classes = [MultiPartParser]

    def get_queryset(self):
        user_type = self.request.user.user_type
        if user_type == UserType.TEACHER:
            return PrivateVideo.objects.all()
        else:
            return PrivateVideo.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        # Get the video instance and check permissions  
        instance = self.get_object()
        self.check_object_permissions(request, instance)  # Ensure permission check
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    

## SHARED FILE-TYPE VIEWSETS -------------------------------------------------------------


from .models import SharedFile, Announcement
from .serializers import SharedFileSerializer, AnnouncementSerializer

 


class SharedFileListCreateView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    # Only teachers can upload, but everyone can download/view
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsTeacherUser()]
        return [permissions.AllowAny()]

    def get(self, request, pk=None):
        if pk:
            # Fetch a single file
            file = get_object_or_404(SharedFile, pk=pk)
            serializer = SharedFileSerializer(file)
            return Response(serializer.data)
        # Fetch all files
        files = SharedFile.objects.all()
        serializer = SharedFileSerializer(files, many=True)
        return Response(serializer.data)

    def post(self, request):
        print("Request data:", request.data)
        serializer = SharedFileSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(uploaded_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


    def delete(self, request, pk=None):
            file = get_object_or_404(SharedFile, pk=pk)
            if request.user != file.uploaded_by:
                return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
            file.delete()
            return Response({"message": "File deleted successfully"}, status=status.HTTP_204_NO_CONTENT)




class AnnouncementListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsTeacherUser()]
        return [permissions.IsAuthenticated()]


    def get(self, request, pk=None):
        if pk:
            # Fetch a single announcement
            announcement = get_object_or_404(Announcement, pk=pk)
            serializer = AnnouncementSerializer(announcement)
            return Response(serializer.data)
        # Fetch all announcements
        announcements = Announcement.objects.all().order_by('-posted_at')
        serializer = AnnouncementSerializer(announcements, many=True)
        return Response(serializer.data)


    def post(self, request):
        serializer = AnnouncementSerializer(data=request.data, context={'request': request})
        print("request data :", request.data)
        if serializer.is_valid():
            serializer.save(posted_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, pk=None):
        announcement = get_object_or_404(Announcement, pk=pk)
        if request.user != announcement.posted_by:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        announcement.delete()
        return Response({"message": "Announcement deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    def download_shared_file(request, file_id):
        try:
            print(f"DEBUG: Downloading shared file with ID: {file_id}")

            # Fetch the shared file object
            shared_file = get_object_or_404(SharedFile, id=file_id)
            print(f"DEBUG: Found shared file: {shared_file.title}")

            # Retrieve the file path and ensure it exists
            file_path = shared_file.file.path
            if not os.path.exists(file_path):
                print(f"ERROR: File path does not exist - {file_path}")
                return HttpResponse("File not found on server", status=404)

            # Construct the file name with the original extension
            original_file_name = os.path.basename(file_path)
            file_extension = os.path.splitext(original_file_name)[1]
            file_name = f"{shared_file.title.strip()}{file_extension}" if shared_file.title else original_file_name
            print(f"DEBUG: Final file name constructed: {file_name}")

            # Guess the MIME type
            mimetypes.add_type('application/pdf', '.pdf', strict=True)
            mimetypes.add_type('image/jpeg', '.jpg', strict=True)
            mimetypes.add_type('image/png', '.png', strict=True)
            mimetypes.add_type('audio/mpeg', '.mp3', strict=True)
            mimetypes.add_type('audio/wav', '.wav', strict=True)
            mimetypes.add_type('video/mp4', '.mp4', strict=True)
            mimetypes.add_type('video/x-matroska', '.mkv', strict=True)

            content_type, _ = mimetypes.guess_type(file_path)
            print(f"DEBUG: MIME type detected - {content_type}")

            if not content_type:
                content_type = 'application/octet-stream'  # Default MIME type

            print(f"DEBUG: Content type detected - {content_type}")

            # Get the file size
            file_size = os.path.getsize(file_path)

            # Serve the file with correct headers
            response = HttpResponse(content_type=content_type)
            response['Content-Length'] = file_size
            response['Content-Disposition'] = f'attachment; filename="{smart_str(file_name)}"'
            response['Content-Type'] = content_type  # Ensure correct Content-Type is set

            # Stream the file in chunks
            with open(file_path, 'rb') as f:
                response.write(f.read())

            print(f"DEBUG: Response created successfully for file {file_name}")
            return response

        except FileNotFoundError:
            print(f"ERROR: File not found for id={file_id}")
            raise Http404("File not found.")
        except Exception as e:
            print(f"ERROR: Exception occurred - {str(e)}")
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
