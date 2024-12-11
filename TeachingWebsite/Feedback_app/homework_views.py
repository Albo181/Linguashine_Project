from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from .models import Homework
from .homework_serializers import HomeworkSerializer
from Users.models import CustomUser
from django.db.models import Q
from django.core.mail import EmailMessage
from django.conf import settings

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
            
            # Create homework without file
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
            
            # If there's a file, send it via email immediately
            if file:
                try:
                    print("Preparing to send email...")
                    print(f"From: {settings.EMAIL_HOST_USER}")
                    print(f"To: {student.email}")
                    print(f"Using SMTP: {settings.EMAIL_HOST}:{settings.EMAIL_PORT}")
                    
                    subject = f'New Homework Assignment'
                    message = f'''
                    Teacher: {request.user.first_name} {request.user.last_name}
                    Due Date: {homework.due_date.strftime('%d/%m/%Y %H:%M')}
                    Instructions: {homework.instructions[:100]}...
                    
                    Please find the attached homework assignment.
                    '''
                    
                    email = EmailMessage(
                        subject,
                        message,
                        settings.EMAIL_HOST_USER,
                        [student.email]
                    )
                    email.attach(file.name, file.read(), file.content_type)
                    
                    # Try to send with debug info
                    try:
                        print("Attempting to send email...")
                        email.send(fail_silently=False)
                        print("Email sent successfully!")
                    except Exception as send_error:
                        print(f"Email send error details: {str(send_error)}")
                        raise send_error
                    
                except Exception as e:
                    # If email fails, we still created the homework, just log the error
                    print(f"Error sending email: {str(e)}")
                    print(f"Error type: {type(e)}")
                    print(f"Error args: {e.args}")
            
            print(f"Successfully created homework {homework.id}")
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
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
