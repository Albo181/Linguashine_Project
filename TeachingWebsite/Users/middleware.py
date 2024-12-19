import logging

logger = logging.getLogger(__name__)

class CustomCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        logger.info(f"CustomCorsMiddleware: Processing request from origin: {request.headers.get('Origin')}")
        
        response = self.get_response(request)
        
        # Only add these headers if they're not already set by django-cors-headers
        if not response.has_header('Access-Control-Allow-Credentials'):
            response["Access-Control-Allow-Credentials"] = "true"
            
        if not response.has_header('Access-Control-Allow-Headers'):
            response["Access-Control-Allow-Headers"] = "Content-Type, X-CSRFToken, Accept, Authorization"
            
        # Always set cookie security headers
        response["SameSite"] = "None"
        response["Secure"] = "true"
        
        logger.info(f"CustomCorsMiddleware: Response headers: {dict(response.headers)}")
        return response
