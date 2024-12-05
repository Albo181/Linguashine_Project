import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'TeachingWebsite.settings')
django.setup()

from Feedback_app.models import Feedback

def update_grade_percentages():
    feedbacks = Feedback.objects.all()
    updated_count = 0
    
    for feedback in feedbacks:
        if feedback.grade_awarded is not None and feedback.grade_total is not None:
            old_percent = feedback.grade_percent
            feedback.grade_percent = round((feedback.grade_awarded / feedback.grade_total) * 100, 2)
            if old_percent != feedback.grade_percent:
                feedback.save(update_fields=['grade_percent'])
                updated_count += 1
                print(f"Updated feedback ID {feedback.id}: {old_percent} -> {feedback.grade_percent}%")
    
    print(f"\nTotal records updated: {updated_count}")

if __name__ == '__main__':
    update_grade_percentages()
