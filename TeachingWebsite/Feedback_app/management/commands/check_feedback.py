from django.core.management.base import BaseCommand
from Feedback_app.models import Feedback
from Users.models import CustomUser

class Command(BaseCommand):
    help = 'Check feedback data in the database'

    def handle(self, *args, **options):
        # Check total number of feedback records
        feedback_count = Feedback.objects.count()
        self.stdout.write(f"Total feedback records: {feedback_count}")

        # Check user counts
        total_users = CustomUser.objects.count()
        students = CustomUser.objects.filter(user_type='student').count()
        teachers = CustomUser.objects.filter(user_type='teacher').count()
        self.stdout.write(f"\nUser statistics:")
        self.stdout.write(f"Total users: {total_users}")
        self.stdout.write(f"Students: {students}")
        self.stdout.write(f"Teachers: {teachers}")

        # Sample feedback records
        if feedback_count > 0:
            self.stdout.write("\nSample feedback records:")
            for feedback in Feedback.objects.all()[:5]:
                self.stdout.write(
                    f"\nID: {feedback.id}\n"
                    f"Student: {feedback.student_name.username if feedback.student_name else 'None'}\n"
                    f"Send to: {feedback.send_to.username if feedback.send_to else 'None'}\n"
                    f"Submission date: {feedback.submission_date}\n"
                    f"Grade: {feedback.grade_awarded}/{feedback.grade_total} ({feedback.grade_percent}%)"
                )
        else:
            self.stdout.write("\nNo feedback records found in the database.")
