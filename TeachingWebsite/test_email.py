import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Email settings
smtp_server = "smtp.gmail.com"
port = 587
sender_email = "linguashine1@gmail.com"
password = "vhnwtzbdqxbjmfcz"  # Gmail app password

try:
    # Create server object with SSL option
    server = smtplib.SMTP(smtp_server, port)
    server.starttls()  # Secure the connection
    print("Connected to server")
    
    # Try to log in to server and send email
    print("Trying to login...")
    server.login(sender_email, password)
    print("Login successful!")
    
    # Try to send a test email
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = sender_email
    msg['Subject'] = "Test Email from Linguashine"
    body = "This is a test email from your Linguashine teaching platform."
    msg.attach(MIMEText(body, 'plain'))
    
    print("Trying to send email...")
    server.send_message(msg)
    print("Email sent successfully!")
    
    server.quit()
except Exception as e:
    print(f"Error: {str(e)}")
    print(f"Error type: {type(e)}")
