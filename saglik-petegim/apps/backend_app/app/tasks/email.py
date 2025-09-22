"""Email-related background tasks."""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from typing import List, Optional, Dict, Any
import structlog

from app.core.celery import celery_app
from app.core.config import settings

logger = structlog.get_logger()


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def send_email_task(
    self,
    to_email: str,
    subject: str,
    html_content: str,
    text_content: Optional[str] = None,
    from_email: Optional[str] = None,
    from_name: Optional[str] = None,
    attachments: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    """
    Send a single email.
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        html_content: HTML email content
        text_content: Plain text content (optional)
        from_email: Sender email (defaults to settings)
        from_name: Sender name (defaults to settings)
        attachments: List of attachments (optional)
        
    Returns:
        Dict with send status
    """
    try:
        # Use default sender if not provided
        sender_email = from_email or settings.EMAILS_FROM_EMAIL
        sender_name = from_name or settings.EMAILS_FROM_NAME
        
        if not sender_email:
            raise ValueError("No sender email configured")
        
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{sender_name} <{sender_email}>" if sender_name else sender_email
        msg["To"] = to_email
        
        # Add text content
        if text_content:
            text_part = MIMEText(text_content, "plain")
            msg.attach(text_part)
        
        # Add HTML content
        html_part = MIMEText(html_content, "html")
        msg.attach(html_part)
        
        # Add attachments if provided
        if attachments:
            for attachment in attachments:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(attachment["content"])
                encoders.encode_base64(part)
                part.add_header(
                    "Content-Disposition",
                    f"attachment; filename= {attachment['filename']}",
                )
                msg.attach(part)
        
        # Send email
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_TLS:
                server.starttls()
            
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            
            server.send_message(msg)
        
        logger.info("Email sent successfully", to_email=to_email, subject=subject)
        
        return {
            "success": True,
            "to_email": to_email,
            "subject": subject,
            "message": "Email sent successfully",
        }
        
    except smtplib.SMTPException as e:
        logger.error("SMTP error sending email", error=str(e), to_email=to_email)
        
        # Retry on SMTP errors
        if self.request.retries < self.max_retries:
            logger.info("Retrying email send", retry_count=self.request.retries + 1)
            raise self.retry(exc=e, countdown=60 * (self.request.retries + 1))
        
        return {
            "success": False,
            "to_email": to_email,
            "error": f"SMTP error: {str(e)}",
        }
        
    except Exception as e:
        logger.error("Unexpected error sending email", error=str(e), to_email=to_email)
        
        return {
            "success": False,
            "to_email": to_email, 
            "error": f"Unexpected error: {str(e)}",
        }


@celery_app.task(bind=True)
def send_bulk_emails_task(
    self,
    email_data: List[Dict[str, Any]],
    batch_size: int = 10,
) -> Dict[str, Any]:
    """
    Send bulk emails in batches.
    
    Args:
        email_data: List of email data dictionaries
        batch_size: Number of emails to send per batch
        
    Returns:
        Dict with bulk send results
    """
    total_emails = len(email_data)
    successful = 0
    failed = 0
    errors = []
    
    logger.info("Starting bulk email send", total_emails=total_emails)
    
    # Process emails in batches
    for i in range(0, total_emails, batch_size):
        batch = email_data[i:i + batch_size]
        
        for email in batch:
            try:
                # Send individual email
                result = send_email_task.apply_async(
                    kwargs=email,
                    expires=300,  # 5 minutes
                )
                
                # Wait for result (with timeout)
                email_result = result.get(timeout=30)
                
                if email_result.get("success"):
                    successful += 1
                else:
                    failed += 1
                    errors.append({
                        "email": email.get("to_email"),
                        "error": email_result.get("error"),
                    })
                    
            except Exception as e:
                failed += 1
                errors.append({
                    "email": email.get("to_email"),
                    "error": str(e),
                })
                logger.error("Bulk email send error", email=email.get("to_email"), error=str(e))
        
        # Small delay between batches to avoid overwhelming SMTP server
        if i + batch_size < total_emails:
            import time
            time.sleep(1)
    
    result = {
        "total": total_emails,
        "successful": successful,
        "failed": failed,
        "errors": errors,
    }
    
    logger.info(
        "Bulk email send completed",
        total=total_emails,
        successful=successful,
        failed=failed,
    )
    
    return result


@celery_app.task
def send_welcome_email_task(user_email: str, user_name: str) -> Dict[str, Any]:
    """
    Send welcome email to new user.
    
    Args:
        user_email: User's email address
        user_name: User's name
        
    Returns:
        Dict with send status
    """
    subject = f"Welcome to {settings.APP_NAME}!"
    
    html_content = f"""
    <html>
    <body>
        <h1>Welcome to {settings.APP_NAME}, {user_name}!</h1>
        <p>Thank you for registering with our healthcare management system.</p>
        <p>You can now:</p>
        <ul>
            <li>Schedule appointments</li>
            <li>Track your child's growth</li>
            <li>Manage vaccination records</li>
            <li>Access medical records</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <br>
        <p>Best regards,</p>
        <p>The {settings.APP_NAME} Team</p>
    </body>
    </html>
    """
    
    text_content = f"""
    Welcome to {settings.APP_NAME}, {user_name}!
    
    Thank you for registering with our healthcare management system.
    
    You can now:
    - Schedule appointments
    - Track your child's growth
    - Manage vaccination records
    - Access medical records
    
    If you have any questions, please don't hesitate to contact us.
    
    Best regards,
    The {settings.APP_NAME} Team
    """
    
    return send_email_task.delay(
        to_email=user_email,
        subject=subject,
        html_content=html_content,
        text_content=text_content,
    ).get()


@celery_app.task
def send_password_reset_email_task(
    user_email: str, 
    user_name: str, 
    reset_token: str
) -> Dict[str, Any]:
    """
    Send password reset email.
    
    Args:
        user_email: User's email address
        user_name: User's name
        reset_token: Password reset token
        
    Returns:
        Dict with send status
    """
    # TODO: Replace with actual frontend URL
    reset_url = f"https://your-app.com/reset-password?token={reset_token}"
    
    subject = "Password Reset Request"
    
    html_content = f"""
    <html>
    <body>
        <h1>Password Reset Request</h1>
        <p>Hello {user_name},</p>
        <p>We received a request to reset your password for your {settings.APP_NAME} account.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="{reset_url}">Reset Your Password</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <br>
        <p>Best regards,</p>
        <p>The {settings.APP_NAME} Team</p>
    </body>
    </html>
    """
    
    text_content = f"""
    Password Reset Request
    
    Hello {user_name},
    
    We received a request to reset your password for your {settings.APP_NAME} account.
    
    Click the link below to reset your password:
    {reset_url}
    
    This link will expire in 24 hours.
    
    If you didn't request this password reset, please ignore this email.
    
    Best regards,
    The {settings.APP_NAME} Team
    """
    
    return send_email_task.delay(
        to_email=user_email,
        subject=subject,
        html_content=html_content,
        text_content=text_content,
    ).get()


@celery_app.task
def send_appointment_reminder_email_task(
    user_email: str,
    user_name: str,
    patient_name: str,
    appointment_date: str,
    appointment_time: str,
    doctor_name: str,
) -> Dict[str, Any]:
    """
    Send appointment reminder email.
    
    Args:
        user_email: Parent's email address
        user_name: Parent's name
        patient_name: Patient's name
        appointment_date: Appointment date
        appointment_time: Appointment time
        doctor_name: Doctor's name
        
    Returns:
        Dict with send status
    """
    subject = f"Appointment Reminder - {patient_name}"
    
    html_content = f"""
    <html>
    <body>
        <h1>Appointment Reminder</h1>
        <p>Hello {user_name},</p>
        <p>This is a reminder that {patient_name} has an appointment scheduled:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <strong>Date:</strong> {appointment_date}<br>
            <strong>Time:</strong> {appointment_time}<br>
            <strong>Doctor:</strong> {doctor_name}<br>
            <strong>Patient:</strong> {patient_name}
        </div>
        <p>Please arrive 15 minutes early for check-in.</p>
        <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
        <br>
        <p>Best regards,</p>
        <p>{settings.CLINIC_NAME}</p>
        <p>{settings.CLINIC_PHONE}</p>
    </body>
    </html>
    """
    
    text_content = f"""
    Appointment Reminder
    
    Hello {user_name},
    
    This is a reminder that {patient_name} has an appointment scheduled:
    
    Date: {appointment_date}
    Time: {appointment_time}
    Doctor: {doctor_name}
    Patient: {patient_name}
    
    Please arrive 15 minutes early for check-in.
    
    If you need to reschedule or cancel, please contact us as soon as possible.
    
    Best regards,
    {settings.CLINIC_NAME}
    {settings.CLINIC_PHONE}
    """
    
    return send_email_task.delay(
        to_email=user_email,
        subject=subject,
        html_content=html_content,
        text_content=text_content,
    ).get()