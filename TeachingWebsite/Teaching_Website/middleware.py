import logging
import time
from django.utils import timezone
from .log_viewer.models import APILog

logger = logging.getLogger('api_endpoints')

class EndpointLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Start time of request
        start_time = time.time()

        # Get the response
        response = self.get_response(request)

        # Calculate request duration
        duration = time.time() - start_time

        # Create log entry
        APILog.objects.create(
            method=request.method,
            path=request.path,
            status_code=response.status_code,
            duration=f"{duration:.2f}s",
            user=request.user.username if request.user.is_authenticated else 'anonymous',
            ip_address=self.get_client_ip(request),
            level='ERROR' if response.status_code >= 500 else 'WARNING' if response.status_code >= 400 else 'INFO'
        )

        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR', '0.0.0.0')


class CORSMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Add CORS headers
        response["Access-Control-Allow-Origin"] = "https://www.linguashine.es"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-CSRFToken"
        response["Access-Control-Allow-Credentials"] = "true"
        response["Access-Control-Max-Age"] = "86400"  # 24 hours
        
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        if request.method == "OPTIONS":
            response = self.get_response(request)
            response["Access-Control-Allow-Origin"] = "https://www.linguashine.es"
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-CSRFToken"
            response["Access-Control-Allow-Credentials"] = "true"
            response["Access-Control-Max-Age"] = "86400"  # 24 hours
            return response
        return None
