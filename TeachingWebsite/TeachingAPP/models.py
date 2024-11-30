from django.db import models

class Post(models.Model):
    
    SUBJECT = (("TENGO UNA PREGUNTA", "Tengo una pregunta"),		 
		     ("ME GUSTARÍA QUE ME LLAMARAS", "Me gustaría que me llamaras"),
		     ("OTRO MOTIVO", "Otro motivo"))	

    name = models.CharField(max_length=100)
    subject = models.CharField(max_length=100, choices=SUBJECT, default="TENGO UNA PREGUNTA")
    message = models.TextField()
    
    def __str__(self):
        return self.name
    
