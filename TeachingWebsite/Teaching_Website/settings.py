import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-your-key-here')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('RAILWAY_ENVIRONMENT') != 'production'

# If we're in production (DEBUG is False), add railway domain to allowed hosts
if not DEBUG:
    ALLOWED_HOSTS = [
        'localhost',
        '127.0.0.1',
        'linguashineproject-production.up.railway.app',
        '.railway.app',
        '.up.railway.app',
    ]
else:
    ALLOWED_HOSTS = [
        'localhost',
        '127.0.0.1',
    ]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'Users',
    'TeachingAPP',
    'Feedback_app',
    'Documents',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'Teaching_Website.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Teaching_Website.wsgi.application'

# Database
# Try to get the DATABASE_URL from environment, otherwise use default PostgreSQL settings
DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL:  # Only use Railway DB in production
    # Parse database URL
    import dj_database_url
    print("="*50)
    print("DATABASE CONNECTION INFO:")
    print(f"Using production database")
    print(f"Database URL found: {bool(DATABASE_URL)}")
    
    try:
        # Replace internal hostname with external one for local development
        if 'postgres.railway.internal' in DATABASE_URL:
            DATABASE_URL = DATABASE_URL.replace(
                'postgres.railway.internal',
                'autorack.proxy.rlwy.net'
            )
        
        db_config = dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            ssl_require=True
        )
        print(f"Database engine: {db_config.get('ENGINE')}")
        print(f"Database name: {db_config.get('NAME')}")
        print(f"Database host: {db_config.get('HOST')}")
        print(f"Database port: {db_config.get('PORT')}")
        print(f"Database user: {db_config.get('USER')}")
        DATABASES = {
            'default': db_config
        }
        print("Database configuration loaded successfully")
    except Exception as e:
        print(f"Error configuring database: {str(e)}")
    print("="*50)
else:
    # Use SQLite for local development
    print("Using SQLite database for development")
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Security Settings
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = False
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SAMESITE = 'Lax'

# Security Headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
# Don't force SSL redirect as Railway handles HTTPS
SECURE_SSL_REDIRECT = False
# Trust Railway's HTTPS header
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

CSRF_TRUSTED_ORIGINS = [
    'https://linguashineproject-production.up.railway.app',
    'https://attractive-upliftment-production.up.railway.app',
    'http://localhost:5173',
    'http://localhost:5174'
]

# CORS settings
CORS_ALLOWED_ORIGINS = [
    'https://attractive-upliftment-production.up.railway.app',
    'http://localhost:5173',
    'http://localhost:5174'
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'cookie',
]

# Rest Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files (User uploads)
MEDIA_URL = 'media/' if DEBUG else 'https://linguashineproject-production.up.railway.app/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# User model
AUTH_USER_MODEL = 'Users.CustomUser'

# Authentication backends
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
