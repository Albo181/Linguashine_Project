from .models import Feedback, Annotation, TaskType
from Users.models import CustomUser 
from rest_framework import serializers
from .aggregate_serializers import CustomUserSerializer


# DOWNLOAD SERIALIZERS (can we reuse upload ones?) --------------------------------------------------------------

class StudentFetchSerializer(serializers.ModelSerializer):
    student_name = CustomUserSerializer(read_only=True)  # Includes profile_picture from UserSerializer
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
            'submission_date', 
            'feedback_date', 
            'task_type', 
            'grade_awarded', 
            'grade_total', 
            'grade_percent', 
            'teacher_notes',
            'document_area',  # Link to the submitted file
        ]
        read_only_fields = ['id', 'feedback_date', 'grade_percent']

    submission_date = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S.%fZ', required=False)



# UPLOAD SERIALIZERS --------------------------------------------------------------------------------------------------------



class TeacherFeedbackSerializer(serializers.ModelSerializer):
    # For teacher feedback, student_name is the recipient and send_to is the teacher
    student_name = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(user_type='student'))
    send_to = serializers.PrimaryKeyRelatedField(read_only=True)  # This will be set to the current teacher
    
    class Meta:
        model = Feedback
        fields = ['id', 
                  'student_name',  # The student receiving feedback
                  'send_to',      # The teacher sending feedback (auto-set)
                  'submission_date', 
                  'feedback_date', 
                  'task_type', 
                  'grade_awarded', 
                  'grade_total', 
                  'grade_percent', 
                  'teacher_notes', 
                  'document_area']
        read_only_fields = ['id', 'submission_date', 'feedback_date', 'grade_percent', 'send_to']
        
    def validate_task_type(self, value):
        if value not in TaskType.values:
            raise serializers.ValidationError(f"Invalid task_type: {value}")
        return value
        
    def validate_grade_awarded(self, value):
        if value is not None:
            try:
                value = float(value)
                if value < 0:
                    raise serializers.ValidationError("Grade awarded cannot be negative")
            except (TypeError, ValueError):
                raise serializers.ValidationError("Grade awarded must be a valid number")
        return value
        
    def validate_grade_total(self, value):
        if value is not None:
            try:
                value = float(value)
                if value <= 0:
                    raise serializers.ValidationError("Grade total must be greater than 0")
            except (TypeError, ValueError):
                raise serializers.ValidationError("Grade total must be a valid number")
        return value
        
    def validate(self, data):
        # Set the teacher (send_to) as the current user
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required")
            
        if request.user.user_type != 'teacher':
            raise serializers.ValidationError("Only teachers can create teacher feedback")
            
        data['send_to'] = request.user
        
        # Validate grades if provided
        if 'grade_awarded' in data and 'grade_total' in data:
            grade_awarded = data.get('grade_awarded')
            grade_total = data.get('grade_total')
            
            if grade_awarded is not None and grade_total is not None:
                if grade_awarded > grade_total:
                    raise serializers.ValidationError({
                        "grade_awarded": "Grade awarded cannot be greater than total"
                    })
                    
                # Calculate grade percentage
                data['grade_percent'] = (grade_awarded / grade_total) * 100
                
        return data

class StudentFeedbackSerializer(serializers.ModelSerializer):
    student_name = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    send_to = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(user_type='teacher'))
    
    class Meta:
        model = Feedback
        fields = ['id', 
                  'student_name', 
                  'send_to', 
                  'submission_date', 
                  'task_type', 
                  'student_notes', 
                  'document_area']
        read_only_fields = ['id', 'submission_date']
        
    def validate_task_type(self, value):
        if value not in TaskType.values:
            raise serializers.ValidationError(f"Invalid task_type: {value}")
        return value
        
    def validate_student_name(self, value):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required")
            
        if request.user.id != value.id:
            raise serializers.ValidationError("student_name must be the current user")
        return value
        
    def create(self, validated_data):
        student = validated_data.pop('student_name')
        teacher = validated_data.pop('send_to')
        
        return Feedback.objects.create(
            student_name=student,
            send_to=teacher,
            **validated_data
        )
    
###ANNOTATION SERIALIZERS ------------------------------------------------------------------------------------------    

class AnnotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Annotation
        fields = ['id', 'feedback', 'line_number', 'start_offset', 'end_offset', 'comment']