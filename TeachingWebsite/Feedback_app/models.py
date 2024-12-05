from django.db import models
from Users.models import CustomUser
from django.conf import settings
from django.core.validators import FileExtensionValidator
import os
from django.utils import timezone
from django.core.exceptions import ValidationError

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
        # Calculate grade percentage if both grade values are provided
        if self.grade_awarded is not None and self.grade_total is not None:
            if self.grade_total <= 0:
                raise ValueError("Grade total must be greater than 0")
            if self.grade_awarded < 0:
                raise ValueError("Grade awarded cannot be negative")
            if self.grade_awarded > self.grade_total:
                raise ValueError("Grade awarded cannot be greater than total")
                
            self.grade_percent = round((self.grade_awarded / self.grade_total) * 100, 2)
        else:
            self.grade_percent = None
            
        super().save(*args, **kwargs)
 
 
class Annotation(models.Model):
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE, related_name='annotations')
    line_number = models.IntegerField()
    start_offset = models.IntegerField()  # Starting character position
    end_offset = models.IntegerField()    # Ending character position
    comment = models.TextField()

    def __str__(self):
        return f"Annotation for Line {self.line_number}: {self.comment}"

def homework_file_path(instance, filename):
    # Generate file path: homework/teacher_id/student_id/filename
    return f'homework/{instance.teacher.id}/{instance.student.id}/{filename}'

def validate_file_size(value):
    # 25MB limit (in bytes)
    size_limit = 25 * 1024 * 1024
    if value.size > size_limit:
        raise ValidationError(f'File size cannot exceed 25MB. Your file is {value.size / (1024*1024):.1f}MB')

def validate_file_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = [
        '.pdf', '.doc', '.docx',  # Documents
        '.jpg', '.jpeg', '.png', '.gif',  # Images
        '.mp3', '.wav', '.m4a',  # Audio
        '.mp4', '.mov', '.avi'  # Video
    ]
    if ext.lower() not in valid_extensions:
        raise ValidationError('Unsupported file type. Please upload a document, image, audio, or video file.')

class Homework(models.Model):
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='assigned_homework')
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='received_homework')
    set_date = models.DateTimeField()
    due_date = models.DateTimeField()
    instructions = models.TextField()
    comments = models.TextField(blank=True, null=True)
    attachment = models.FileField(upload_to='homework_attachments/', blank=True, null=True, validators=[validate_file_size])
    submitted = models.BooleanField(default=False)
    is_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-due_date']

    def __str__(self):
        return f"Homework for {self.student} from {self.teacher}"

    @property
    def days_until_due(self):
        if self.due_date:
            now = timezone.now()
            delta = self.due_date - now
            return delta.days
        return None

    def clean(self):
        if self.set_date and self.due_date and self.due_date < self.set_date:
            raise ValidationError("Due date cannot be before set date")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

class HomeworkSubmission(models.Model):
    homework = models.ForeignKey(Homework, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    submission_date = models.DateTimeField(auto_now_add=True)
    file = models.FileField(
        upload_to='homework_submissions/',
        validators=[validate_file_size, validate_file_extension]
    )

    def __str__(self):
        return f"Submission by {self.student} for {self.homework}"
