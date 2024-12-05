import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Teaching_Website.settings')
django.setup()

# Print database settings
print("Database Settings:")
print(f"ENGINE: {settings.DATABASES['default']['ENGINE']}")
print(f"NAME: {settings.DATABASES['default']['NAME']}")
print(f"USER: {settings.DATABASES['default']['USER']}")
print(f"HOST: {settings.DATABASES['default']['HOST']}")
print(f"PORT: {settings.DATABASES['default']['PORT']}")

# Try to connect to the database
from django.db import connection
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
        print("\nDatabase connection successful!")
except Exception as e:
    print("\nDatabase connection failed!")
    print(f"Error: {str(e)}")
