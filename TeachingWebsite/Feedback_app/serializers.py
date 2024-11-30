from .models import Feedback, Annotation, TaskType
from Users.models import CustomUser 
from rest_framework import serializers
from .aggregate_serializers import CustomUserSerializer


# DOWNLOAD SERIALIZERS (can we reuse upload ones?) --------------------------------------------------------------

class StudentFetchSerializer(serializers.ModelSerializer):
    student_name = CustomUserSerializer(read_only=True)  # Includes profile_picture from CustomUserSerializer
    send_to = CustomUserSerializer(read_only=True)      # Also includes profile_picture
    

    class Meta:
        model = Feedback
        fields = [
            'id',
            'student_name',  # Student who submitted
            'send_to',       # Teacher who received
            'task_type',
            'submission_date',
            'document_area',  # Link to the submitted file
            'student_notes',
           
        ]
        read_only_fields = ['id', 'submission_date']

    submission_date = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S.%fZ', required=False)
    

class TeacherFetchSerializer(serializers.ModelSerializer):
    student_name = CustomUserSerializer(read_only=True)  # Nested user details for student
    send_to = CustomUserSerializer(read_only=True)      # Nested user details for teacher

    class Meta:
        model = Feedback
        fields = [
            'id',
            'student_name',  # Student who received
            'send_to',       # Teacher who submitted
            'task_type',
            'feedback_date',
            'document_area',  # Link to the submitted file
            'teacher_notes',
            'submission_date',
            'grade_awarded',
            'grade_total',
            'grade_percent',
          
        ]
        read_only_fields = ['id', 'feedback_date', 'grade_percent']

    submission_date = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S.%fZ', required=False)



# UPLOAD SERIALIZERS --------------------------------------------------------------------------------------------------------



class TeacherFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 
                  'student_name', 
                  'send_to', 
                  'submission_date', 
                  'feedback_date', 
                  'task_type', 
                  'grade_awarded', 
                  'grade_total', 
                  'grade_percent', 
                  'student_notes', 
                  'teacher_notes', 
                  'document_area']
        
        def validate_task_type(self, value):
            if value not in TaskType.values:
                raise serializers.ValidationError(f"Invalid task_type: {value}")
            return value
        
        def validate_student_name(self, value):
        # Ensure the student exists
            if not CustomUser.objects.filter(id=value.id).exists():
                raise serializers.ValidationError("Student does not exist.")
            return value
        
        def validate(self, data):
            if 'grade_awarded' in data and 'grade_total' in data:
              
                data['grade_percent'] = (data['grade_awarded'] / data['grade_total']) * 100
          
            return data
    
    document_area = serializers.FileField()  # Make sure this is defined as a FileField
    
    



class StudentFeedbackSerializer(serializers.ModelSerializer):
     
    send_to = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    
    document_area = serializers.FileField()  # Ensure this is correctly defined

    class Meta:
        model = Feedback
        fields = [
            'id', 
            'student_name', 
            'send_to', 
            'grade_awarded',
            'submission_date', 
            'feedback_date', 
            'task_type',
            'student_notes', 
            'document_area'
        ]
        read_only_fields = ['id', 'submission_date', 'feedback_date', 'grade_awarded']
        

    # Ensures task_type is valid
    def validate_task_type(self, value):
        if value not in TaskType.values:
            raise serializers.ValidationError(f"Invalid task_type: {value}")
        return value

    # Ensure send_to (teacher) exists
    def validate_send_to(self, value):
        if not CustomUser.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Teacher does not exist.")
        return value

    # General validation method
    def validate(self, data):
        # Example: Ensure document_area is provided for a student   
        if 'document_area' not in data or data['document_area'] is None:
            raise serializers.ValidationError("A document must be uploaded.")
        return data





    
###ANNOTATION SERIALIZERS ------------------------------------------------------------------------------------------    

class AnnotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Annotation
        fields = ['id', 'feedback', 'line_number', 'start_offset', 'end_offset', 'comment']