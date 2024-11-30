from django.db import models
from Users.models import CustomUser

# Create your models here.
class TaskType(models.TextChoices):
    
    CAMBRIDGE = 'Cambridge', "Cambridge"
    APTIS = 'Aptis', "Aptis"
    EOI = 'EOI', 'Escuela Oficial de Idiomas'
    IELTS = 'IELTS', "Ielts"
    TRINITY = 'Trinity', "Trinity"
    HOMEWORK = '(Homework task)', "Homework Task"
    ESSAY = '(Essay)', "Essay"
    PROJECT = '(Project)', "Project"
    OTHER = '*Other*', "Other"
    

class Feedback(models.Model):
    student_name = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        related_name="feedbacks_as_student"  # Custom related name
    )  
    send_to = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        related_name="feedbacks_as_teacher"  # Custom related name
    )
    submission_date = models.DateTimeField(auto_now_add=True)  
    feedback_date = models.DateTimeField(auto_now_add=True)   
    task_type = models.CharField(max_length=20, choices=TaskType.choices)
    grade_awarded = models.FloatField(blank=True, null=True)
    grade_total = models.FloatField(blank=True, null=True)
    grade_percent = models.FloatField(blank=True, null=True)   
    student_notes = models.TextField(blank=True)   
    teacher_notes = models.TextField(blank=True)  
    document_area = models.FileField(upload_to="student_work/")
    
    def save(self, *args, **kwargs):
        print('cats')
        if self.grade_awarded and self.grade_total:
            self.grade_percent = (self.grade_awarded / self.grade_total) * 100
           
        super().save(*args, **kwargs)
 
 
class Annotation(models.Model):
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE, related_name='annotations')
    line_number = models.IntegerField()
    start_offset = models.IntegerField()  # Starting character position
    end_offset = models.IntegerField()    # Ending character position
    comment = models.TextField()

    def __str__(self):
        return f"Annotation for Line {self.line_number}: {self.comment}"
