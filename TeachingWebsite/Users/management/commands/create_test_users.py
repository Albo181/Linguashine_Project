from django.core.management.base import BaseCommand
from Users.models import CustomUser

class Command(BaseCommand):
    help = 'Creates test users (students and teachers) for development'

    def handle(self, *args, **kwargs):
        # Create test student
        student, created = CustomUser.objects.get_or_create(
            username='teststudent',
            defaults={
                'email': 'teststudent@example.com',
                'first_name': 'Test',
                'last_name': 'Student',
                'user_type': 'student',
            }
        )
        if created:
            student.set_password('testpass123')
            student.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully created student user: {student.username}'))
        else:
            self.stdout.write(self.style.WARNING(f'Student user already exists: {student.username}'))

        # Create test teacher
        teacher, created = CustomUser.objects.get_or_create(
            username='testteacher',
            defaults={
                'email': 'testteacher@example.com',
                'first_name': 'Test',
                'last_name': 'Teacher',
                'user_type': 'teacher',
            }
        )
        if created:
            teacher.set_password('testpass123')
            teacher.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully created teacher user: {teacher.username}'))
        else:
            self.stdout.write(self.style.WARNING(f'Teacher user already exists: {teacher.username}'))
