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
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-bk5yy!vw)_^73af-1@=@6zpb+8+p-3l_=4k5^=_zy$p=-0zmc3'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']


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
]

X_FRAME_OPTIONS = 'ALLOW'

AUTH_USER_MODEL = 'Users.CustomUser'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',    
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CSRF_COOKIE_NAME = "csrftoken"
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = 'Lax'  # Required for cross-origin requests
CSRF_COOKIE_SECURE = False  # Use True if using HTTPS in development ***
CSRF_TRUSTED_ORIGINS = ['http://127.0.0.1:8000', 'http://localhost:5173']
#CSRF_COOKIE_DOMAIN = 'None'

SESSION_COOKIE_SAMESITE = 'Lax'  # Required for cross-origin requests ***
SESSION_COOKIE_AGE = 60 * 60 * 24 * 7 * 2  # 2 weeks, in seconds
SESSION_COOKIE_HTTPONLY = False #pi says will allow me to see cookies while developing locally (set back to true for security on deployment)
#SESSION_COOKIE_DOMAIN = 'localhost' #***
SESSION_COOKIE_SECURE = False  # Use True if using HTTPS in development
SECURE_SSL_REDIRECT = False

SESSION_SAVE_EVERY_REQUEST = True


FILE_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB max size, adjust as needed
DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB max size for all request data    


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],

    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ],
}
# settings.py
# settings.py
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',
    'django.contrib.auth.hashers.BCryptPasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
]


CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5173",  # Add your frontend local URL here
    "http://localhost:5173",
    "http://127.0.0.1:5174",  # Add your frontend local URL here
    "http://localhost:5174",
]
CORS_ALLOW_CREDENTIALS = True
# Allows cookies with cross-origin requests
# CSRF settings, if using different origin for frontend/backend
CSRF_TRUSTED_ORIGINS = [
    "http://127.0.0.1:8000",  # Backend's origin
    "http://localhost:5173",   # Frontend's origin
    "http://localhost:5174",   # Frontend's origin
]

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https?://localhost(:[0-9]+)?$"
]

CORS_ALLOW_HEADERS = [
    "X-CSRFToken",
    "Content-Type",
    "Authorization"
 
]

load_dotenv()  # Load the environment variables from .env file

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.office365.com'  
EMAIL_PORT = 587  
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER') 
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')  # email password or app-specific password
DEFAULT_FROM_EMAIL = os.environ.get('EMAIL_HOST_USER')


import os

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

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
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


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

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

# Static files configuration (for fallback image, if applicable)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
