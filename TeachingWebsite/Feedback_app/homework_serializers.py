from rest_framework import serializers
from .models import Homework, HomeworkSubmission
from Users.models import CustomUser
from django.core.mail import EmailMessage
from django.conf import settings
import os

class HomeworkSerializer(serializers.ModelSerializer):
    days_until_due = serializers.IntegerField(read_only=True)
    teacher_name = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()
    student = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),  
        error_messages={
            'does_not_exist': 'Invalid user ID. Please select a valid user.',
            'incorrect_type': 'Invalid user ID format.'
        }
    )
    submitted = serializers.BooleanField(read_only=True)

    class Meta:
        model = Homework
        fields = [
            'id',
            'teacher',
            'student',
            'set_date',
            'due_date',
            'instructions',
            'comments',
            'attachment',
            'is_sent',
            'days_until_due',
            'teacher_name',
            'student_name',
            'submitted'
        ]
        read_only_fields = ['is_sent', 'submitted']

    def get_teacher_name(self, obj):
        return f"{obj.teacher.first_name} {obj.teacher.last_name}"

    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"

    # Remove student type validation for testing
    # def validate_student(self, value):
    #     if not value.user_type == 'student':
    #         raise serializers.ValidationError("Selected user must be a student.")
    #     return value

    def create(self, validated_data):
        try:
            # Create the homework instance first
            homework = Homework.objects.create(**validated_data)
            print(f"Created homework instance with ID: {homework.id}")

            try:
                # Get the student's email
                student_email = homework.student.email
                if student_email:  # Only try to send email if there's an email address
                    # Prepare email content
                    subject = f'New Homework Assignment from {homework.teacher.first_name} {homework.teacher.last_name}'
                    message = f"""
Dear {homework.student.first_name},

You have received a new homework assignment:

Set Date: {homework.set_date.strftime('%d/%m/%Y %H:%M')}
Due Date: {homework.due_date.strftime('%d/%m/%Y %H:%M')}

Instructions:
{homework.instructions}

Comments:
{homework.comments if homework.comments else 'No additional comments.'}

Please log in to view the full assignment details.
"""
                    try:
                        # Print debug info
                        print(f"Attempting to send email to: {student_email}")
                        print(f"Using email settings:")
                        print(f"HOST: {settings.EMAIL_HOST}")
                        print(f"PORT: {settings.EMAIL_PORT}")
                        print(f"USER: {settings.EMAIL_HOST_USER}")
                        print(f"TLS: {settings.EMAIL_USE_TLS}")
                        
                        # Send email
                        email = EmailMessage(
                            subject=subject,
                            body=message,
                            from_email=settings.EMAIL_HOST_USER,
                            to=[student_email]
                        )

                        # If there's an attachment, add it to the email
                        if homework.attachment:
                            print(f"Attaching file: {homework.attachment.path}")
                            email.attach_file(homework.attachment.path)

                        print("Sending email...")
                        email.send(fail_silently=False)
                        
                        # After successful email send, delete the file
                        if homework.attachment:
                            file_path = homework.attachment.path
                            # Delete the file from storage
                            if os.path.exists(file_path):
                                os.remove(file_path)
                                print(f"File deleted: {file_path}")
                            # Clear the attachment field in the database
                            homework.attachment = None
                            homework.save()
                            print("Attachment field cleared from database")

                        # Mark homework as sent
                        homework.is_sent = True
                        homework.save()
                        print("Email sent successfully and file cleaned up")
                    except Exception as email_error:
                        print(f"Failed to send email: {str(email_error)}")
                        print(f"Error type: {type(email_error)}")
                        # Don't raise the error, just log it
            except Exception as e:
                print(f"Error in email handling: {str(e)}")
                # Don't raise the error, just log it

            return homework

        except Exception as e:
            print(f"Error in homework creation: {str(e)}")
            raise serializers.ValidationError(f"Failed to create homework: {str(e)}")

class HomeworkSubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    homework_details = serializers.SerializerMethodField()

    class Meta:
        model = HomeworkSubmission
        fields = [
            'id',
            'homework',
            'student',
            'submission_date',
            'file',
            'student_name',
            'homework_details'
        ]
        read_only_fields = ['submission_date']

    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"

    def get_homework_details(self, obj):
        return {
            'instructions': obj.homework.instructions,
            'due_date': obj.homework.due_date,
            'teacher_name': f"{obj.homework.teacher.first_name} {obj.homework.teacher.last_name}"
        }
