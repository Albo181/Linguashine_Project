import os
import django
from django.contrib.auth.hashers import make_password

# Set up Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Teaching_Website.settings")
django.setup()

# Get the user model
from django.contrib.auth import get_user_model
User = get_user_model()

# Update admin user
try:
    admin_user = User.objects.get(username='admin')
    admin_user.password = make_password('admin123')  # Set password to 'admin123'
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.is_active = True
    admin_user.save()
    print("Admin user updated successfully")
except User.DoesNotExist:
    # Create new admin if doesn't exist
    User.objects.create(
        username='admin',
        password=make_password('admin123'),
        email='admin@example.com',
        is_staff=True,
        is_superuser=True,
        is_active=True,
        first_name='Admin',
        last_name='User'
    )
    print("New admin user created successfully")
