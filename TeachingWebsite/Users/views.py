from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from rest_framework import status, parsers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import RetrieveUpdateAPIView
from .models import CustomUser
from .serializers import StudentAccessSerializer, UserProfileSerializer
from .permissions import IsStudentAndLoggedIn
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics
from rest_framework.throttling import AnonRateThrottle
from django.db import connection

def session_id_check(request):
    session = request.session
    session.save()
    session_key = session.session_key
    print(f"Session key: {session_key}")

     
    return HttpResponse("Session key retrieved.")


#Sets CSRF token in cookies if not already present
@ensure_csrf_cookie             #prepares a backend response, sets cookie in response
def get_csrf_token(request):
    """
    Sets CSRF token in cookies if not already present.
    """
    csrf_token = get_token(request)  # Always generate a new token
    response = JsonResponse({"csrfToken": csrf_token})
    response["X-CSRFToken"] = csrf_token
    response["Access-Control-Allow-Origin"] = "https://www.linguashine.es"
    response["Access-Control-Allow-Credentials"] = "true"
    return response


#Checks log-in status   
@method_decorator(csrf_exempt, name='dispatch')  # Temporarily exempt this view from CSRF
class CheckAuthView(APIView):   
    permission_classes = [AllowAny]  # Explicitly allow unauthenticated access
    
    def options(self, request, *args, **kwargs):
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "https://www.linguashine.es"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "*"
        response["Access-Control-Allow-Credentials"] = "true"
        response["Access-Control-Max-Age"] = "86400"  # Cache preflight for 24 hours
        return response
    
    def get(self, request):
        response = JsonResponse({
            'logged_in': request.user.is_authenticated
        }, status=200)
        response["Access-Control-Allow-Origin"] = "https://www.linguashine.es"
        response["Access-Control-Allow-Credentials"] = "true"
        return response


#Gets all users from backend
class AllUsersProfileView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer  # Use your custom serializer

    def get_queryset(self):
        # Filter by user_type if provided in query params
        user_type = self.request.query_params.get('user_type', None)
        queryset = CustomUser.objects.all()
        
        if user_type:
            queryset = queryset.filter(user_type=user_type)
            
        return queryset

    def list(self, request, *args, **kwargs):
        users = self.get_queryset()
        print("Available users:")
        for user in users:
            print(f"ID: {user.id}, Username: {user.username}, Email: {user.email}, Type: {user.user_type}")
        
        return super().list(request, *args, **kwargs)


### ----AMEND PROFILE DATA VIEW --------------------------------------------------------------------------------


@method_decorator(ensure_csrf_cookie, name='dispatch')
class StudentProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user = request.user
        serializer = StudentAccessSerializer(user, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = StudentAccessSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            # Handle profile picture upload
            if 'profile_picture' in request.FILES:
                if user.profile_picture:
                    user.profile_picture.delete(save=False)
                user.profile_picture = request.FILES['profile_picture']
            
            # Save other profile data
            serializer.save()

            # Return full URL for profile picture
            response_data = serializer.data
            if user.profile_picture:
                response_data['profile_picture_url'] = request.build_absolute_uri(user.profile_picture.url)

            return Response(response_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginRateThrottle(AnonRateThrottle):
    rate = '5/minute'

@method_decorator(ensure_csrf_cookie, name='dispatch')
class CustomLoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    def options(self, request, *args, **kwargs):
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "https://www.linguashine.es"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, X-CSRFToken"
        response["Access-Control-Allow-Credentials"] = "true"
        return response

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Log request details (safely)
        print("="*50)
        print("LOGIN ATTEMPT DEBUG INFO:")
        print(f"Login attempt for user: {username}")
        print(f"Content-Type: {request.content_type}")
        print(f"Request method: {request.method}")
        print(f"Request data type: {type(request.data)}")
        print(f"Request data keys: {request.data.keys()}")
        print(f"CSRF Token in headers: {request.headers.get('X-CSRFToken')}")
        print(f"Session ID: {request.session.session_key}")
        print(f"Is secure: {request.is_secure()}")
        print(f"Current cookies: {request.COOKIES}")
        print("="*50)

        # Validate input
        if not username or not password:
            print("Login failed: Missing username or password")
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user exists first
        try:
            user_exists = CustomUser.objects.filter(username=username).exists()
            if not user_exists:
                print(f"Login failed: User {username} does not exist")
                return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print(f"Database error checking user: {str(e)}")
            return Response({'error': 'Server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Authenticate user
        try:
            user = authenticate(request, username=username, password=password)
            print(f"Authentication result for {username}: {'Success' if user else 'Failed'}")
            
            if user is not None:
                if user.is_active:
                    login(request, user)
                    print(f"Login successful for user: {username}")
                    print(f"New session ID: {request.session.session_key}")
                    serializer = StudentAccessSerializer(user)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    print(f"Login failed: User {username} is inactive")
                    return Response({'error': 'User account is inactive'}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                print(f"Login failed: Invalid credentials for user {username}")
                return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print(f"Authentication error: {str(e)}")
            return Response({'error': 'Server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class CustomLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request) #clears the session
        return JsonResponse({'message': 'Logout successful'}, status=status.HTTP_200_OK)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'user_type': user.user_type,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch user info', 'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


#Gets user data from backend
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user = request.user
        serializer = StudentAccessSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        try:
            user = request.user
            serializer = StudentAccessSerializer(user, data=request.data, partial=True)
            
            if serializer.is_valid():
                if 'profile_picture' in request.FILES:
                    try:
                        # Delete old picture if it exists
                        if user.profile_picture:
                            try:
                                user.profile_picture.delete(save=False)
                            except Exception as e:
                                print(f"Error deleting old profile picture: {str(e)}")
                        
                        # Save new picture
                        user.profile_picture = request.FILES['profile_picture']
                        print(f"New profile picture assigned: {user.profile_picture}")
                    except Exception as e:
                        print(f"Error handling profile picture: {str(e)}")
                        return Response(
                            {"error": f"Error processing profile picture: {str(e)}"},
                            status=500
                        )
                
                try:
                    serializer.save()
                    return Response(serializer.data)
                except Exception as e:
                    print(f"Error saving serializer: {str(e)}")
                    return Response(
                        {"error": f"Error saving profile: {str(e)}"},
                        status=500
                    )
            return Response(serializer.errors, status=400)
        except Exception as e:
            print(f"Unexpected error in profile update: {str(e)}")
            return Response(
                {"error": f"Unexpected error: {str(e)}"},
                status=500
            )


def test_db_connection(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            row = cursor.fetchone()
            
        # Get all tables in the database
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """)
            tables = [row[0] for row in cursor.fetchall()]
            
        # Count users
        from django.contrib.auth import get_user_model
        User = get_user_model()
        user_count = User.objects.count()
            
        return JsonResponse({
            'status': 'success',
            'message': 'Database connection successful',
            'database': connection.settings_dict['NAME'],
            'tables': tables,
            'user_count': user_count
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Database connection failed: {str(e)}'
        }, status=500)
