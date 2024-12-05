from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Reset admin password and ensure superuser status'

    def handle(self, *args, **options):
        User = get_user_model()
        
        # Update or create admin user
        admin_user, created = User.objects.update_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'password': make_password('admin123'),
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
                'first_name': 'Admin',
                'last_name': 'User',
                'user_type': 'teacher',
                'forum_access': True,
                'receive_email_notifications': True
            }
        )

        self.stdout.write(
            self.style.SUCCESS('Successfully reset admin user password')
        )
