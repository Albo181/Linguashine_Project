from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

# Get the admin user
admin_user = User.objects.get(username='admin')

# Set new password
admin_user.password = make_password('admin123')
admin_user.is_staff = True
admin_user.is_superuser = True
admin_user.save()

print("Password reset successfully for admin user")
