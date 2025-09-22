"""Background tasks for the healthcare management system."""

from app.tasks.email import send_email_task, send_bulk_emails_task
from app.tasks.notifications import (
    send_appointment_reminders,
    send_vaccination_reminders,
    send_birthday_reminders,
    process_notification,
)
from app.tasks.appointments import check_overdue_appointments
from app.tasks.reports import generate_daily_report, generate_monthly_report
from app.tasks.maintenance import cleanup_old_notifications, database_maintenance

__all__ = [
    # Email tasks
    "send_email_task",
    "send_bulk_emails_task",
    
    # Notification tasks
    "send_appointment_reminders",
    "send_vaccination_reminders", 
    "send_birthday_reminders",
    "process_notification",
    
    # Appointment tasks
    "check_overdue_appointments",
    
    # Report tasks
    "generate_daily_report",
    "generate_monthly_report",
    
    # Maintenance tasks
    "cleanup_old_notifications",
    "database_maintenance",
]