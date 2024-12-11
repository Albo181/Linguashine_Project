from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from .models import Homework
from .homework_serializers import HomeworkSerializer
from Users.models import CustomUser
from django.db.models import Q
from django.core.mail import EmailMessage, get_connection
from django.conf import settings
import smtplib
import logging

logger = logging.getLogger('django.mail')

class HomeworkViewSet(viewsets.ModelViewSet):
    serializer_class = HomeworkSerializer
    parser_classes = (MultiPartParser, FormParser)
    
    def get_queryset(self):
        user = self.request.user
        # For testing: show homework where user is either teacher or student
        return Homework.objects.filter(
            Q(teacher=user) | Q(student=user)
        ).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        try:
            # Log request data for debugging
            print("Creating homework with data:", request.data)
            print("Student ID from request:", request.data.get('student'))
            print("Teacher ID from request:", request.data.get('teacher'))

            # Validate that the student exists
            try:
                student_id = request.data.get('student')
                student = CustomUser.objects.get(id=student_id)
            except CustomUser.DoesNotExist:
                return Response(
                    {"error": "Invalid data", "detail": {"student": [f"User with ID {student_id} does not exist."]}},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get the file from request
            file = request.FILES.get('attachment')
            print("\n=== File Handling Debug ===")
            print(f"Request method: {request.method}")
            print(f"Content-Type: {request.content_type}")
            print(f"All FILES: {dict(request.FILES)}")
            
            if file:
                print(f"\nFile details:")
                print(f"- Name: {file.name}")
                print(f"- Size: {file.size} bytes")
                print(f"- Content type: {file.content_type}")
                
                # Create homework without file first
                homework_data = request.data.copy()
                if 'attachment' in homework_data:
                    del homework_data['attachment']
                    
                serializer = self.get_serializer(data=homework_data)
                if not serializer.is_valid():
                    print("Validation errors:", serializer.errors)
                    return Response(
                        {"error": "Invalid data", "detail": serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                homework = serializer.save()
                
                # Now handle email with file
                try:
                    print("\n=== Email Sending Debug ===")
                    print(f"Sending to: {student.email}")
                    print(f"From: {settings.EMAIL_HOST_USER}")
                    print(f"SMTP: {settings.EMAIL_HOST}:{settings.EMAIL_PORT}")
                    print(f"TLS: {settings.EMAIL_USE_TLS}")
                    
                    # Enable SMTP debug mode
                    smtplib.SMTP.debuglevel = 2
                    
                    # Get a new connection
                    print("Creating SMTP connection...")
                    connection = get_connection(
                        host=settings.EMAIL_HOST,
                        port=settings.EMAIL_PORT,
                        username=settings.EMAIL_HOST_USER,
                        password=settings.EMAIL_HOST_PASSWORD,
                        use_tls=settings.EMAIL_USE_TLS,
                        timeout=30
                    )
                    
                    try:
                        print("Testing SMTP connection...")
                        connection.open()
                        print("SMTP connection successful!")
                    except Exception as conn_error:
                        print(f"SMTP Connection Error: {str(conn_error)}")
                        raise
                    
                    subject = f'New Homework Assignment'
                    message = f'''
                    Teacher: {request.user.first_name} {request.user.last_name}
                    Due Date: {homework.due_date.strftime('%d/%m/%Y %H:%M')}
                    Instructions: {homework.instructions[:100]}...
                    
                    Please find the attached homework assignment.
                    '''
                    
                    # Create email with connection
                    email = EmailMessage(
                        subject,
                        message,
                        settings.EMAIL_HOST_USER,
                        [student.email],
                        connection=connection
                    )
                    
                    # Read and attach file
                    file_content = file.read()
                    print(f"File content length: {len(file_content)} bytes")
                    email.attach(file.name, file_content, file.content_type)
                    print("File attached to email")
                    
                    # Send with debug
                    try:
                        print("Attempting to send email...")
                        email.send(fail_silently=False)
                        print("Email sent successfully!")
                    except Exception as send_error:
                        print(f"Email Send Error: {str(send_error)}")
                        raise
                    finally:
                        print("Closing SMTP connection...")
                        connection.close()
                    
                except Exception as e:
                    print(f"\nEmail Error: {str(e)}")
                    print(f"Error Type: {type(e)}")
                    print(f"Error Args: {e.args}")
                    # Continue even if email fails
                
                return Response(
                    serializer.data,
                    status=status.HTTP_201_CREATED
                )
            else:
                # Handle case with no file
                serializer = self.get_serializer(data=request.data)
                if serializer.is_valid():
                    homework = serializer.save()
                    return Response(
                        serializer.data,
                        status=status.HTTP_201_CREATED
                    )
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            print(f"Error creating homework: {str(e)}")
            return Response(
                {"error": "Failed to create homework", "detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get homework due in the next 7 days"""
        user = request.user
        now = timezone.now()
        seven_days_later = now + timezone.timedelta(days=7)
        
        # For testing: show upcoming homework where user is either teacher or student
        homework = Homework.objects.filter(
            (Q(teacher=user) | Q(student=user)) &
            Q(due_date__range=[now, seven_days_later])
        ).order_by('due_date')
        
        serializer = self.get_serializer(homework, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def due_soon(self, request):
        """Get homework due in the next 3 days"""
        user = request.user
        now = timezone.now()
        three_days_later = now + timezone.timedelta(days=3)
        
        if user.user_type == 'student':
            homework = Homework.objects.filter(
                student=user,
                due_date__range=[now, three_days_later]
            ).order_by('due_date')
        else:
            homework = Homework.objects.filter(
                teacher=user,
                due_date__range=[now, three_days_later]
            ).order_by('due_date')
        
        serializer = self.get_serializer(homework, many=True)
        return Response(serializer.data)
