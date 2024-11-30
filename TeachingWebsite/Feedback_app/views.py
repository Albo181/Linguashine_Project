from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Feedback, Annotation, TaskType

from .permissions import IsStudent, IsTeacher
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.views import APIView
from rest_framework.decorators import action
from Users.models import CustomUser, UserType
 
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.generics import ListAPIView
 
from .serializers import (TeacherFeedbackSerializer, StudentFeedbackSerializer, 
                          AnnotationSerializer, CustomUserSerializer,
                          StudentFetchSerializer, TeacherFetchSerializer)
from .utils import notify_students_on_upload


# NOTIFICATION VIEWS -------------------------------------------------------------------------------------------------
   
class UpdateNotificationPreference(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        receive_notifications = request.data.get('receive_email_notifications', None)
        if receive_notifications is not None:
            request.user.student.receive_email_notifications = receive_notifications
            request.user.student.save()
            return Response({'message': 'Preference updated successfully.'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid data.'}, status=status.HTTP_400_BAD_REQUEST)

#-------------------------------------------------------------------------------------------------------------------

@method_decorator(ensure_csrf_cookie, name='dispatch')
class TaskTypeListView(APIView):
    def get(self, request, *args, **kwargs):
        task_types = [choice[0] for choice in TaskType.choices]
        return Response(task_types, status=status.HTTP_200_OK)

@method_decorator(ensure_csrf_cookie, name='dispatch')
class UserViewSet(ReadOnlyModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class GradeSummaryViewSet(APIView):
    permission_classes = [IsAuthenticated]
 
    def get_queryset(self, student_id=None):
        user = self.request.user
        if user.user_type == UserType.STUDENT:
            return Feedback.objects.filter(send_to=user)
        elif student_id:
            return Feedback.objects.filter(send_to_id=student_id)
        return Feedback.objects.all()

    def get(self, request):
        student_id = request.query_params.get("student")
        queryset = self.get_queryset(student_id)
        serializer = TeacherFetchSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def delete(self, request, pk=None):
        """
        Allows only teachers to delete feedback records.
        """
        user = request.user
        # Ensure only teachers can delete
        if user.user_type != UserType.TEACHER:
            return Response(
                {"detail": "You do not have permission to delete this feedback."},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            feedback = Feedback.objects.get(pk=pk)
        except Feedback.DoesNotExist:
            return Response(
                {"detail": "Feedback not found."}, status=status.HTTP_404_NOT_FOUND
            )

        # Perform deletion
        feedback.delete()
        return Response(
            {"detail": "Feedback deleted successfully."}, status=status.HTTP_204_NO_CONTENT
        )
         
    
    


 
### HOMEWORK DOWNLOAD VIEWS ------------------------------------------------------------------------------------------------------


#--TEACHER---------------------------------------------------------------------------------

class TeacherReceivedHomeworkView(ListAPIView):
    permission_classes = [IsAuthenticated, IsTeacher]
    serializer_class = StudentFetchSerializer  # Same serializer as for students

    def get_queryset(self):
        # Fetch submissions matching teacher to objects with 'sent_to' 
        return Feedback.objects.filter(send_to=self.request.user)


class TeacherSubmittedHomeworkView(ListAPIView):
    permission_classes = [IsAuthenticated, IsTeacher]
    serializer_class = TeacherFetchSerializer  # Existing teacher serializer

    def get_queryset(self):
        # Fetch submissions matching teacher to objects with 'sent_to' 
        return Feedback.objects.filter(student_name=self.request.user)

#--STUDENT---------------------------------------------------------------------------------
    
class StudentSubmittedHomeworkView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StudentFetchSerializer

    def get_queryset(self):
        # Fetch submissions sent by the logged-in student
        return Feedback.objects.filter(student_name=self.request.user)

class StudentReceivedHomeworkView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TeacherFetchSerializer

    def get_queryset(self):
        # Fetch submissions where the logged-in student is the recipient
        return Feedback.objects.filter(send_to=self.request.user, submission_date__isnull=False)



 
### HOMEWORK UPLOAD VIEWS ------------------------------------------------------------------------------------------------------

import mimetypes
from rest_framework import parsers
 
@method_decorator(ensure_csrf_cookie, name='dispatch')
class TeacherUploadView(APIView):
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    permission_classes = [IsAuthenticated]  # Ensure the user is logged in

    ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

    def post(self, request, *args, **kwargs):
        try:
            # Extract data from request
            student_name = request.data.get("student_name")  # student_name is the sender (includes teachers)
            teacher_notes = request.data.get("teacher_notes")
            send_to = request.data.get("send_to")
            task_type = request.data.get("task_type")
            grade_awarded = request.data.get("grade_awarded")
            grade_total = request.data.get("grade_total")
            document_area = request.FILES.get("document_area")

            # Validate the file type
            if document_area:
                mime_type, _ = mimetypes.guess_type(document_area.name)
                if mime_type not in self.ALLOWED_FILE_TYPES:
                    return Response({"error": "Invalid file type. Allowed types are: PDF, DOCX, DOC."}, status=status.HTTP_400_BAD_REQUEST)

            # Check if student_name was provided
            if not student_name:
                return Response({"error": "student_name is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Fetch the student instance based on the provided student_name
            student_instance = CustomUser.objects.get(pk=student_name)

            # Prepare data for the serializer
            data = {
                "student_name": student_instance.id,  # Use the student instance
                "teacher_notes": teacher_notes,
                "send_to": send_to,
                "task_type": task_type,
                "grade_awarded": grade_awarded,
                "grade_total": grade_total,
                "document_area": document_area,
            }

            # Create and validate the serializer
            serializer = TeacherFeedbackSerializer(data=data, context={'request': request})

            if serializer.is_valid():
                # Save the submission and get the instance
                submission = serializer.save()

                # Notify the student if they opted for email notifications
                notify_students_on_upload(student_instance, submission)

                return Response({
                    "message": "Teacher upload successful!",
                    "id": submission.id,
                    "annotations": [],
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except CustomUser.DoesNotExist:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



@method_decorator(ensure_csrf_cookie, name='dispatch')
class StudentUploadView(APIView):
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    permission_classes = [IsAuthenticated]  # Ensure the user is logged in

    ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

    def post(self, request, *args, **kwargs):
        try:
            # Extract data from request
            student_name = request.data.get("student_name")  # The student who is uploading
            student_notes = request.data.get("student_notes")
            send_to = request.data.get("send_to")
            task_type = request.data.get("task_type")
            document_area = request.FILES.get("document_area")

            # Validate the file type
            if document_area:
                mime_type, _ = mimetypes.guess_type(document_area.name)
                if mime_type not in self.ALLOWED_FILE_TYPES:
                    return Response({"error": "Invalid file type. Allowed types are: PDF, DOCX, DOC."}, status=status.HTTP_400_BAD_REQUEST)

            # Ensure student_name and send_to are valid CustomUser instances
            try:
                student_instance = CustomUser.objects.get(pk=student_name)
                send_to_instance = CustomUser.objects.get(pk=send_to)
            except CustomUser.DoesNotExist:
                return Response({"error": "Student or recipient not found."}, status=status.HTTP_404_NOT_FOUND)

            # Prepare data for the serializer
            data = {
                "student_name": student_instance.id,  # Automatically set the current user as the student
                "student_notes": student_notes,
                "send_to": send_to_instance.id,  # Pass the recipient's instance ID
                "task_type": task_type,
                "document_area": document_area,
            }

            # Create and validate the serializer
            serializer = StudentFeedbackSerializer(data=data, context={'request': request})

            if serializer.is_valid():
                # Save the submission and get the instance
                submission = serializer.save()

                # Notify the student if they opted for email notifications
                notify_students_on_upload(student_instance, submission)

                return Response({
                    "message": "Student upload successful!",
                    "id": submission.id,
                    "annotations": [],
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
    




###ANNOTATION VIEW ------------------------------------------------------------------------------------------------


class AnnotationView(APIView):
    def post(self, request):
        """
        Create a new annotation.
        """
        serializer = AnnotationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        """
        Retrieve annotations for a specific feedback.
        """
        feedback_id = request.query_params.get('feedback_id')
        if not feedback_id:
            return Response({"error": "Feedback ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        annotations = Annotation.objects.filter(feedback_id=feedback_id)
        serializer = AnnotationSerializer(annotations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)