from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Feedback, Annotation, TaskType, Homework, HomeworkSubmission
from .permissions import IsStudent, IsTeacher
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.views import APIView
from rest_framework.decorators import action, api_view, permission_classes
from Users.models import CustomUser, UserType
 
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.generics import ListAPIView
 
from .serializers import (TeacherFeedbackSerializer, StudentFeedbackSerializer, 
                          AnnotationSerializer, CustomUserSerializer,
                          StudentFetchSerializer, TeacherFetchSerializer)
from .homework_serializers import HomeworkSubmissionSerializer, HomeworkSerializer
from .utils import notify_students_on_upload
from django.db.models import Q
import logging
from django.core.mail import EmailMessage
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)

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
        logger.debug(f"Getting feedback for user {user.username} (type: {user.user_type})")
        
        if user.user_type == 'student':
            # For students, show all their feedback, not just graded ones
            queryset = Feedback.objects.filter(
                student_name=user
            ).order_by('-submission_date')
            logger.debug(f"Student query returned {queryset.count()} records")
            return queryset
            
        elif user.user_type == 'teacher':
            # For teachers, show all feedback they've given
            base_query = Feedback.objects.filter(send_to=user)
            if student_id:
                try:
                    student = CustomUser.objects.get(username=student_id)
                    base_query = base_query.filter(student_name=student)
                    logger.debug(f"Found student {student.username}, filtering feedback")
                except CustomUser.DoesNotExist:
                    logger.error(f"Student with username {student_id} not found")
                    return Feedback.objects.none()
            
            queryset = base_query.order_by('-submission_date')
            logger.debug(f"Teacher query returned {queryset.count()} records")
            return queryset
            
        return Feedback.objects.none()

    def get(self, request):
        logger.info(f"Grade summary request from user: {request.user.username} (type: {request.user.user_type})")
        student_id = request.query_params.get("student")
        logger.debug(f"Received student_id: {student_id}")
        
        queryset = self.get_queryset(student_id)
        logger.debug(f"Query returned {queryset.count()} records")
        
        # Log the actual SQL query being executed
        logger.debug(f"SQL Query: {queryset.query}")
        
        # Log each feedback record for debugging
        for feedback in queryset:
            logger.debug(f"Feedback: student={feedback.student_name.username}, teacher={feedback.send_to.username}, grade={feedback.grade_awarded}")
        
        serializer = TeacherFetchSerializer(queryset, many=True)
        data = serializer.data
        
        # Add debug logging
        logger.debug(f"User type: {request.user.user_type}")
        logger.debug(f"Student ID filter: {student_id}")
        logger.debug(f"Query returned {len(data)} records")
        logger.debug(f"Serialized data: {data}")
        
        return Response(data, status=status.HTTP_200_OK)

    def delete(self, request, pk=None):
        """
        Allows only teachers to delete feedback records.
        """
        user = request.user
        # Ensure only teachers can delete
        if user.user_type != 'teacher':
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

class TeacherReceivedHomeworkView(APIView):
    """Teacher's Inbox - Shows homework submitted by students to this teacher"""
    permission_classes = [IsAuthenticated, IsTeacher]
    serializer_class = StudentFetchSerializer

    def get_queryset(self):
        # Show feedback where teacher is the recipient (send_to) and not hidden
        return Feedback.objects.filter(
            send_to=self.request.user,
            grade_awarded__isnull=True,  # Only show ungraded submissions
            hidden_from_teacher=False  # Don't show hidden submissions
        ).order_by('-submission_date')

    def get(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            feedback = Feedback.objects.get(pk=pk, send_to=request.user)
            feedback.hidden_from_teacher = True  # Hide instead of delete
            feedback.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Feedback.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class TeacherSubmittedHomeworkView(APIView):
    """Teacher's Outbox - Shows graded work sent back to students"""
    permission_classes = [IsAuthenticated, IsTeacher]
    serializer_class = TeacherFetchSerializer

    def get_queryset(self):
        return Feedback.objects.filter(
            send_to=self.request.user,
            grade_awarded__isnull=False,  # Only show graded submissions
            hidden_from_teacher=False  # Don't show hidden submissions
        ).order_by('-submission_date')

    def get(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            feedback = Feedback.objects.get(pk=pk, send_to=request.user)
            feedback.hidden_from_teacher = True  # Hide instead of delete
            feedback.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Feedback.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

#--STUDENT---------------------------------------------------------------------------------
    
class StudentSubmittedHomeworkView(APIView):
    """Student's Outbox - Shows homework sent to teachers"""
    permission_classes = [IsAuthenticated, IsStudent]
    serializer_class = StudentFetchSerializer

    def get_queryset(self):
        return Feedback.objects.filter(
            student_name=self.request.user,
            hidden_from_student=False  # Don't show hidden submissions
        ).order_by('-submission_date')

    def get(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            feedback = Feedback.objects.get(pk=pk, student_name=request.user)
            feedback.hidden_from_student = True  # Hide instead of delete
            feedback.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Feedback.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class StudentReceivedHomeworkView(APIView):
    """Student's Inbox - Shows homework assigned by teachers"""
    permission_classes = [IsAuthenticated, IsStudent]
    serializer_class = TeacherFetchSerializer

    def get_queryset(self):
        return Feedback.objects.filter(
            student_name=self.request.user,
            grade_awarded__isnull=False,
            hidden_from_student=False  # Don't show hidden submissions
        ).order_by('-submission_date')

    def get(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            feedback = Feedback.objects.get(pk=pk, student_name=request.user)
            feedback.hidden_from_student = True  # Hide instead of delete
            feedback.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Feedback.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
### HOMEWORK UPLOAD VIEWS ------------------------------------------------------------------------------------------------------

import mimetypes
from rest_framework import parsers
 
@method_decorator(ensure_csrf_cookie, name='dispatch')
class UploadView(APIView):
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    permission_classes = [IsAuthenticated]
    ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    MAX_FILE_SIZE = 25 * 1024 * 1024  # 25MB limit for email attachments

    def post(self, request, *args, **kwargs):
        try:
            logger.info(f"Upload attempt by {request.user.username} (ID: {request.user.id})")
            
            # Extract data from request
            data = {
                'student_name': request.data.get('student_name'),
                'send_to': request.data.get('send_to'),
                'task_type': request.data.get('task_type'),
                'document_area': request.FILES.get('document_area')
            }
            
            if request.user.user_type == 'teacher':
                data['teacher_notes'] = request.data.get('teacher_notes')
                data['grade_awarded'] = request.data.get('grade_awarded')
                data['grade_total'] = request.data.get('grade_total')
            else:
                data['student_notes'] = request.data.get('student_notes')
            
            logger.info(f"Processed data: {data}")
            
            # Validate file
            if not data['document_area']:
                return Response(
                    {"error": "Document file is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check file size
            if data['document_area'].size > self.MAX_FILE_SIZE:
                return Response(
                    {"error": f"File size too large. Maximum size allowed is 25MB."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            mime_type, _ = mimetypes.guess_type(data['document_area'].name)
            if mime_type not in self.ALLOWED_FILE_TYPES:
                return Response(
                    {"error": "Invalid file type. Allowed types are: PDF, DOCX, DOC."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create serializer with request context
            if request.user.user_type == 'teacher':
                serializer = TeacherFeedbackSerializer(
                    data=data,
                    context={'request': request}
                )
            else:
                serializer = StudentFeedbackSerializer(
                    data=data,
                    context={'request': request}
                )
            
            if serializer.is_valid():
                logger.info("Serializer is valid")
                submission = serializer.save()
                logger.info(f"Submission created with ID: {submission.id}")
                return Response({
                    "message": "Homework submitted successfully!",
                    "id": submission.id
                }, status=status.HTTP_201_CREATED)
            else:
                logger.error(f"Serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.exception("Unexpected error in UploadView")
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_homework(request):
    try:
        homework_id = request.POST.get('homework_id')
        if not homework_id:
            return Response({'error': 'homework_id is required'}, status=400)
            
        homework = Homework.objects.get(id=homework_id)
        
        # Check if this is the student's homework
        if request.user.id != homework.student.id:
            return Response({'error': 'You can only submit your own homework'}, status=403)
            
        # Check if homework is already submitted
        if HomeworkSubmission.objects.filter(homework=homework, student=request.user).exists():
            return Response({'error': 'You have already submitted this homework'}, status=400)
        
        # Get the file from request
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)
            
        try:
            # Send email to teacher immediately with the file
            subject = f'Homework Submission from {request.user.first_name} {request.user.last_name}'
            message = f'''
            Student: {request.user.first_name} {request.user.last_name}
            Homework: {homework.instructions[:100]}...
            Submitted: {timezone.now().strftime('%d/%m/%Y %H:%M')}
            File Type: {file.content_type}
            
            Please find the attached homework submission.
            '''
            
            # Send email with attachment
            email = EmailMessage(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [homework.teacher.email]
            )
            email.attach(file.name, file.read(), file.content_type)
            email.send()
            
            # Update homework status without storing the file
            homework.submitted = True
            homework.save()
            
            return Response({
                'message': 'Homework submitted successfully'
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=400)
            
    except Homework.DoesNotExist:
        return Response({'error': 'Homework not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

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