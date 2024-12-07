import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Teaching_Website.settings')
os.environ['DATABASE_URL'] = 'postgresql://postgres:sJypeIXPTqQLfsmWiShWyAPfgcMnglso@autorack.proxy.rlwy.net:17815/railway'

django.setup()

User = get_user_model()

# Create superuser with required fields
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='your_password_here',
        telephone='1234567890',  # Add required telephone field
        bio='Admin user'  # Add required bio field
    )
    print("Superuser created successfully!")
else:
    print("Superuser already exists.")
