from django.core.management.base import BaseCommand
from Users.models import CustomUser

class Command(BaseCommand):
    help = 'Creates a test student user'

    def handle(self, *args, **kwargs):
        try:
            # Create test student user
            student = CustomUser.objects.create_user(
                username='test_student',
                email='test@example.com',  # You can change this to your email
                password='testpass123',
                first_name='Test',
                last_name='Student',
                user_type='student',
                receive_email_notifications=True
            )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created test student user: {student.username}\n'
                    f'Email: {student.email}\n'
                    f'Password: testpass123'
                )
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Failed to create test user: {str(e)}')
            )
