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
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics
from rest_framework.throttling import AnonRateThrottle


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
    csrf_token = request.COOKIES.get("csrftoken")
    if not csrf_token:
        csrf_token = get_token(request)  # Generate a new CSRF token if not present
    response_data = {"csrfToken": csrf_token}
    return JsonResponse(response_data)


#Checks log-in status   
class CheckAuthView(APIView):   
    def get(self, request):
        if request.user.is_authenticated:
            return JsonResponse({'logged_in': True}, status=200)
             
        else:
            return JsonResponse({'logged_in': False}, status=200)
        
        
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
class StudentProfileView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = CustomUser.objects.all()
    serializer_class = StudentAccessSerializer
    parser_classes = [MultiPartParser, FormParser]  # DRF - handles incoming file uploads

    def get_object(self):
        # Automatically retrieve the logged-in user's profile
        return self.request.user

    def update(self, request, *args, **kwargs):
        # Handle profile updates, including profile picture
        user = self.get_object()  # Get the current logged-in user
        serializer = self.get_serializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            # Save the changes to the user model (including profile picture if uploaded)
            serializer.save()

            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginRateThrottle(AnonRateThrottle):
    rate = '5/minute'

@method_decorator(ensure_csrf_cookie, name='dispatch')
class CustomLoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Validate input
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate user
        user = authenticate(request, username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                # Serialize and return user data (avoid sensitive data)
                serializer = StudentAccessSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'User account is inactive'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)




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

    def get(self, request):
        user = request.user
        serializer = StudentAccessSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
