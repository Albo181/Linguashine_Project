import os
import django
import sys

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Teaching_Website.settings')
django.setup()

from django.db import connection
from Users.models import CustomUser
from Feedback_app.models import Feedback

def check_feedback_data():
    print("\n=== Checking Feedback Data ===")
    
    # Check total users
    print("\nUser counts by type:")
    user_counts = CustomUser.objects.values('user_type').annotate(count=django.db.models.Count('id'))
    for count in user_counts:
        print(f"{count['user_type']}: {count['count']} users")
    
    # Check total feedback
    total_feedback = Feedback.objects.count()
    print(f"\nTotal feedback entries: {total_feedback}")
    
    # Sample feedback entries
    print("\nSample feedback entries:")
    for feedback in Feedback.objects.select_related('student_name', 'send_to')[:5]:
        print(f"\nID: {feedback.id}")
        print(f"Student: {feedback.student_name.username}")
        print(f"Teacher: {feedback.send_to.username}")
        print(f"Grade: {feedback.grade_awarded}/{feedback.grade_total} ({feedback.grade_percent}%)")
        print(f"Task Type: {feedback.task_type}")
        print(f"Submission Date: {feedback.submission_date}")
        print("-" * 50)

if __name__ == '__main__':
    check_feedback_data()
