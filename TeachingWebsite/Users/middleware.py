import logging
from django.http import HttpResponse

logger = logging.getLogger(__name__)

class CustomCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log the incoming request
        logger.info(f"CustomCorsMiddleware: Processing request from origin: {request.headers.get('Origin')}")
        logger.info(f"Request headers: {dict(request.headers)}")
        
        # Handle preflight requests
        if request.method == 'OPTIONS':
            response = HttpResponse()
            self._set_cors_headers(response, request)
            return response
            
        # Process the request normally
        response = self.get_response(request)
        
        # Set CORS headers on response
        self._set_cors_headers(response, request)
        
        # Log the response
        logger.info(f"Response headers: {dict(response.headers)}")
        return response
        
    def _set_cors_headers(self, response, request):
        """Set basic CORS headers that we know work with the health check endpoint"""
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "*"
        return response
