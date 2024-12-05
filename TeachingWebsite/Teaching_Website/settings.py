"""
Django settings for Teaching_Website project.

Generated by 'django-admin startproject' using Django 5.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
import os
import logging
from dotenv import load_dotenv

# Configure logging
logger = logging.getLogger(__name__)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env file
load_dotenv(os.path.join(BASE_DIR, '.env'))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('RAILWAY_ENVIRONMENT') != 'production'

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    'linguashineproject-production.up.railway.app',
    '.railway.app',
]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'TeachingAPP',
    'Users',
    'Feedback_app',
    'rest_framework',
    'corsheaders',
    'Documents',
    'django_extensions',
    'Teaching_Website.log_viewer',  
    'Teaching_Website',
]

X_FRAME_OPTIONS = 'ALLOW'

AUTH_USER_MODEL = 'Users.CustomUser'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
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
    'Teaching_Website.middleware.EndpointLoggingMiddleware',  
]

CSRF_COOKIE_NAME = "csrftoken"
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = 'Lax'  # Required for cross-origin requests
CSRF_COOKIE_SECURE = os.getenv('RAILWAY_ENVIRONMENT') == 'production'
CSRF_TRUSTED_ORIGINS = [
    'https://linguashineproject-production.up.railway.app',
]

SESSION_COOKIE_SAMESITE = 'Lax'  # Required for cross-origin requests ***
SESSION_COOKIE_AGE = 60 * 60 * 24 * 7 * 2  # 2 weeks, in seconds
SESSION_COOKIE_HTTPONLY = False #pi says will allow me to see cookies while developing locally (set back to true for security on deployment)
#SESSION_COOKIE_DOMAIN = 'localhost'
SESSION_COOKIE_SECURE = os.getenv('RAILWAY_ENVIRONMENT') == 'production'
SECURE_SSL_REDIRECT = os.getenv('RAILWAY_ENVIRONMENT') == 'production'
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

SESSION_SAVE_EVERY_REQUEST = True


# File Upload Settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 26214400  # 25MB in bytes
DATA_UPLOAD_MAX_MEMORY_SIZE = 26214400  # 25MB in bytes
MAX_UPLOAD_SIZE = 26214400  # 25MB in bytes

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],

    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FormParser',
    ],

    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',  # 100 requests per hour for anonymous users
        'user': '1000/hour',  # 1000 requests per hour for authenticated users
        'login': '5/minute',  # 5 login attempts per minute
    },
    'DEFAULT_THROTTLE_MESSAGE': 'Too many requests. Please try again in {wait} seconds.',
}

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',  # Vite development server
    'https://linguashineproject-production.up.railway.app',
]

CORS_ALLOW_CREDENTIALS = True

# Security Headers
SECURE_HSTS_SECONDS = 31536000 if os.getenv('RAILWAY_ENVIRONMENT') == 'production' else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = os.getenv('RAILWAY_ENVIRONMENT') == 'production'
SECURE_HSTS_PRELOAD = os.getenv('RAILWAY_ENVIRONMENT') == 'production'

# Static and Media Files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

# Ensure static and media directories exist
os.makedirs(os.path.join(BASE_DIR, 'static'), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, 'media'), exist_ok=True)

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Whitenoise for static files in production
if os.getenv('RAILWAY_ENVIRONMENT') == 'production':
    MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

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


# Database configuration
import dj_database_url

# Railway PostgreSQL configuration
if os.getenv('RAILWAY_ENVIRONMENT') == 'production':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'railway',
            'USER': 'postgres',
            'PASSWORD': 'sJypeIXPTqQLfsmWiShWyAPfgcMnglso',
            'HOST': 'postgres.railway.internal',
            'PORT': '5432',
            'OPTIONS': {
                'sslmode': 'require',
                'connect_timeout': 5,
            }
        }
    }
else:
    # Local development database
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'linguashine_project',
            'USER': 'postgres',
            'PASSWORD': 'Trgi105manzana123',
            'HOST': 'localhost',
            'PORT': '5432',
        }
    }

# Log final configuration (without sensitive data)
db_config = DATABASES['default'].copy()
if 'PASSWORD' in db_config:
    db_config['PASSWORD'] = '********'
logger.info(f"Final database config: {db_config}")

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-gb'

TIME_ZONE = 'Europe/London'

USE_I18N = True

USE_TZ = True

DATE_FORMAT = 'd/m/Y'
DATETIME_FORMAT = 'd/m/Y H:i'
SHORT_DATE_FORMAT = 'd/m/Y'
SHORT_DATETIME_FORMAT = 'd/m/Y H:i'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Logging Configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/api_endpoints.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'api_endpoints': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

# Ensure logs directory exists
if not os.path.exists('logs'):
    os.makedirs('logs')

# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True').lower() == 'true'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')

# Log email configuration (without sensitive data)
email_config = {
    'EMAIL_HOST': EMAIL_HOST,
    'EMAIL_PORT': EMAIL_PORT,
    'EMAIL_USE_TLS': EMAIL_USE_TLS,
    'EMAIL_HOST_USER': EMAIL_HOST_USER,
    'EMAIL_HOST_PASSWORD': '********' if EMAIL_HOST_PASSWORD else ''
}
logger.info(f"Email configuration: {email_config}")

DEFAULT_FROM_EMAIL = os.getenv('EMAIL_HOST_USER')
