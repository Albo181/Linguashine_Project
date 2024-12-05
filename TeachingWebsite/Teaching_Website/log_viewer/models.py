from django.db import models

class APILog(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    method = models.CharField(max_length=10)
    path = models.CharField(max_length=255)
    status_code = models.IntegerField()
    duration = models.CharField(max_length=20)
    user = models.CharField(max_length=150)
    ip_address = models.GenericIPAddressField()
    level = models.CharField(max_length=20)

    class Meta:
        verbose_name = 'API Log'
        verbose_name_plural = 'API Logs'
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.timestamp} - {self.method} {self.path} ({self.status_code})"
