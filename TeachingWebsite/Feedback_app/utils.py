# utils.py
from django.core.mail import send_mail
from django.conf import settings

def notify_students_on_upload(student, document):
    if student.receive_email_notifications:
        send_mail(
            subject="New Document Uploaded",
            message=f"A new document has been uploaded to your profile: {document.document_area.name}.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[student.user.email],
        )
