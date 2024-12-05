from django.core.management.base import BaseCommand
from Feedback_app.models import Feedback
from Users.models import CustomUser

class Command(BaseCommand):
    help = 'Check database data for debugging'

    def handle(self, *args, **kwargs):
        # Check users
        self.stdout.write("\n=== Users ===")
        users = CustomUser.objects.all()
        self.stdout.write(f"Total users: {users.count()}")
        
        for user in users:
            self.stdout.write(f"\nUsername: {user.username}")
            self.stdout.write(f"User type: {user.user_type}")
            self.stdout.write(f"ID: {user.id}")
            self.stdout.write("-" * 40)

        # Check feedback
        self.stdout.write("\n=== Feedback ===")
        feedback = Feedback.objects.all()
        self.stdout.write(f"Total feedback entries: {feedback.count()}")
        
        for f in feedback:
            self.stdout.write(f"\nID: {f.id}")
            self.stdout.write(f"Student: {f.student_name.username if f.student_name else 'None'}")
            self.stdout.write(f"Teacher: {f.send_to.username if f.send_to else 'None'}")
            self.stdout.write(f"Task Type: {f.task_type}")
            self.stdout.write(f"Submission Date: {f.submission_date}")
            self.stdout.write(f"Grade: {f.grade_awarded}/{f.grade_total} ({f.grade_percent}%)")
            self.stdout.write("-" * 40)
