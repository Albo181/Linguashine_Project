from django.core.management.base import BaseCommand
from Users.models import CustomUser, UserType
from Feedback_app.models import Feedback

class Command(BaseCommand):
    help = 'Fix data inconsistencies in the database'

    def handle(self, *args, **kwargs):
        # Fix user types
        alex = CustomUser.objects.get(username='alex')
        natalia = CustomUser.objects.get(username='natalia69')

        if alex.user_type != 'teacher':
            alex.user_type = 'teacher'
            alex.save()
            self.stdout.write(f"Fixed user type for {alex.username} to teacher")

        if natalia.user_type != 'student':
            natalia.user_type = 'student'
            natalia.save()
            self.stdout.write(f"Fixed user type for {natalia.username} to student")

        # Fix feedback entries
        feedback = Feedback.objects.all()
        for f in feedback:
            needs_save = False
            
            # Fix user roles if they're reversed
            if f.student_name.user_type == 'teacher' or f.send_to.user_type == 'student':
                # Swap student_name and send_to
                temp_student = f.student_name
                f.student_name = f.send_to
                f.send_to = temp_student
                needs_save = True
                self.stdout.write(f"Fixed feedback ID {f.id}: swapped student and teacher")

            # Fix invalid grades
            if f.grade_awarded and f.grade_total:
                if f.grade_total < f.grade_awarded:
                    # Make total higher than awarded
                    old_total = f.grade_total
                    f.grade_total = f.grade_awarded * 2  # Double the awarded grade for a reasonable total
                    needs_save = True
                    self.stdout.write(f"Fixed feedback ID {f.id}: updated grade total from {old_total} to {f.grade_total}")
                elif f.grade_total <= 0:
                    # Fix invalid total
                    old_total = f.grade_total
                    f.grade_total = 100  # Set a reasonable default
                    f.grade_awarded = min(f.grade_awarded, f.grade_total)  # Ensure awarded doesn't exceed total
                    needs_save = True
                    self.stdout.write(f"Fixed feedback ID {f.id}: updated invalid grade total from {old_total} to {f.grade_total}")

            if needs_save:
                f.save()

        self.stdout.write(self.style.SUCCESS('Data fix completed successfully'))
