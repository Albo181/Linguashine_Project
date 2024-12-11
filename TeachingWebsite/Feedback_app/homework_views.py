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
            print("\n=== Starting Homework Creation ===")
            print(f"Request method: {request.method}")
            print(f"Content type: {request.content_type}")
            print(f"Files in request: {request.FILES}")
            print(f"Data in request: {request.data}")
            
            # Get the file from request
            file = request.FILES.get('attachment')
            if file:
                print("\n=== File Details ===")
                print(f"File name: {file.name}")
                print(f"File size: {file.size}")
                print(f"Content type: {file.content_type}")
            else:
                print("\nNo file attached in request")
                
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
                    
                    # Test SMTP connection directly
                    import smtplib
                    from email.mime.text import MIMEText
                    from email.mime.multipart import MIMEMultipart
                    from email.mime.application import MIMEApplication
                    
                    print("\nTesting direct SMTP connection...")
                    try:
                        # Create SMTP connection
                        smtp = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
                        smtp.set_debuglevel(2)  # Show all SMTP communication
                        
                        # Identify ourselves to SMTP server
                        print("Saying hello to SMTP server...")
                        smtp.ehlo()
                        
                        # Start TLS
                        if settings.EMAIL_USE_TLS:
                            print("Starting TLS...")
                            smtp.starttls()
                            smtp.ehlo()  # Need to say hello again after TLS
                        
                        # Login
                        print("Attempting login...")
                        smtp.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
                        print("Login successful!")
                        
                        # Create message
                        print("Creating email message...")
                        msg = MIMEMultipart()
                        msg['From'] = settings.EMAIL_HOST_USER
                        msg['To'] = student.email
                        msg['Subject'] = 'New Homework Assignment'
                        
                        body = f'''
                        Teacher: {request.user.first_name} {request.user.last_name}
                        Due Date: {homework.due_date.strftime('%d/%m/%Y %H:%M')}
                        Instructions: {homework.instructions[:100]}...
                        
                        Please find the attached homework assignment.
                        '''
                        msg.attach(MIMEText(body, 'plain'))
                        
                        # Attach file
                        print("Attaching file...")
                        file_content = file.read()
                        part = MIMEApplication(file_content, Name=file.name)
                        part['Content-Disposition'] = f'attachment; filename="{file.name}"'
                        msg.attach(part)
                        
                        # Send email
                        print("Sending email...")
                        smtp.send_message(msg)
                        print("Email sent successfully!")
                        
                        # Update is_sent flag
                        homework.is_sent = True
                        homework.save()
                        print("Updated homework is_sent flag")
                        
                        # Close connection
                        smtp.quit()
                        print("SMTP connection closed properly")
                        
                    except Exception as e:
                        print(f"\nSMTP Error: {str(e)}")
                        print(f"Error Type: {type(e)}")
                        print(f"Error Args: {e.args}")
                        # Continue even if email fails
                        raise
                
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
