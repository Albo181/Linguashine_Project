from django.core.management.base import BaseCommand
from Feedback_app.models import Feedback

class Command(BaseCommand):
    help = 'Updates all grade percentages to have 2 decimal places'

    def handle(self, *args, **kwargs):
        feedbacks = Feedback.objects.all()
        updated_count = 0
        
        for feedback in feedbacks:
            if feedback.grade_awarded is not None and feedback.grade_total is not None:
                old_percent = feedback.grade_percent
                feedback.grade_percent = round((feedback.grade_awarded / feedback.grade_total) * 100, 2)
                if old_percent != feedback.grade_percent:
                    feedback.save(update_fields=['grade_percent'])
                    updated_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Updated feedback ID {feedback.id}: {old_percent} -> {feedback.grade_percent}%"
                        )
                    )
        
        self.stdout.write(
            self.style.SUCCESS(f"\nTotal records updated: {updated_count}")
        )
