from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

# Create a new superuser
User.objects.create(
    username='newadmin',
    email='newadmin@example.com',
    password=make_password('admin123'),
    is_staff=True,
    is_superuser=True,
    is_active=True,
    first_name='New',
    last_name='Admin',
    user_type='teacher',
    forum_access=True,
    receive_email_notifications=True
)

print("New admin user created successfully")
