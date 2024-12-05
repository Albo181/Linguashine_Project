import multiprocessing
import os

# Gunicorn configuration
bind = f"0.0.0.0:{os.getenv('PORT', '8000')}"
workers = multiprocessing.cpu_count() * 2 + 1
threads = 2
worker_class = 'gthread'
worker_connections = 1000
timeout = 120
keepalive = 5
max_requests = 1000
max_requests_jitter = 50

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# Worker lifecycle
graceful_timeout = 30
preload_app = True

def on_starting(server):
    """Log when server is starting."""
    server.log.info("Starting Gunicorn server...")

def on_reload(server):
    """Log when server is reloading."""
    server.log.info("Reloading Gunicorn server...")

def post_fork(server, worker):
    """Reset database connections after fork."""
    from django.db import connections
    for conn in connections.all():
        conn.close()
        conn.connect()
