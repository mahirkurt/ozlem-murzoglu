"""Notification-related background tasks."""

from datetime import datetime, date, timedelta
from typing import List, Dict, Any
import structlog

from app.core.celery import celery_app

logger = structlog.get_logger()


@celery_app.task(bind=True)
def send_appointment_reminders(self) -> Dict[str, Any]:
    """
    Send appointment reminders for upcoming appointments.
    
    This task runs hourly and sends reminders for appointments
    that are 24 hours away and haven't had reminders sent yet.
    
    Returns:
        Dict with task results
    """
    try:
        from app.core.database import AsyncSessionLocal
        from app.models.appointment import Appointment, AppointmentStatus
        from app.models.user import User
        from app.models.patient import Patient
        from app.tasks.email import send_appointment_reminder_email_task
        from sqlalchemy import select, and_
        
        # Calculate reminder window (24 hours from now)
        tomorrow = datetime.utcnow() + timedelta(hours=24)
        reminder_start = tomorrow.replace(hour=0, minute=0, second=0, microsecond=0)
        reminder_end = reminder_start + timedelta(days=1)
        
        reminders_sent = 0
        errors = []
        
        async with AsyncSessionLocal() as db:
            # Get appointments that need reminders
            stmt = select(Appointment).join(Patient).join(User).where(
                and_(
                    Appointment.appointment_date >= reminder_start,
                    Appointment.appointment_date < reminder_end,
                    Appointment.status.in_([
                        AppointmentStatus.SCHEDULED,
                        AppointmentStatus.CONFIRMED,
                    ]),
                    Appointment.reminder_sent == False,
                )
            )
            
            result = await db.execute(stmt)
            appointments = result.scalars().all()
            
            for appointment in appointments:
                try:
                    # Send reminder email
                    send_appointment_reminder_email_task.delay(
                        user_email=appointment.patient.parent.email,
                        user_name=appointment.patient.parent.full_name,
                        patient_name=appointment.patient.full_name,
                        appointment_date=appointment.appointment_date.strftime("%Y-%m-%d"),
                        appointment_time=appointment.appointment_date.strftime("%H:%M"),
                        doctor_name=appointment.doctor.full_name,
                    )
                    
                    # Mark reminder as sent
                    appointment.reminder_sent = True
                    appointment.reminder_sent_at = datetime.utcnow()
                    
                    reminders_sent += 1
                    
                except Exception as e:
                    errors.append({
                        "appointment_id": str(appointment.id),
                        "error": str(e),
                    })
                    logger.error("Failed to send appointment reminder", 
                               appointment_id=appointment.id, error=str(e))
            
            # Commit changes
            await db.commit()
        
        result = {
            "reminders_sent": reminders_sent,
            "errors": errors,
            "total_appointments": len(appointments),
        }
        
        logger.info("Appointment reminders processed", **result)
        return result
        
    except Exception as e:
        logger.error("Failed to process appointment reminders", error=str(e))
        raise


@celery_app.task(bind=True)
def send_vaccination_reminders(self) -> Dict[str, Any]:
    """
    Send vaccination reminders for due vaccinations.
    
    This task runs daily and sends reminders for vaccinations
    that are due within the next week.
    
    Returns:
        Dict with task results
    """
    try:
        from app.core.database import AsyncSessionLocal
        from app.models.vaccination import Vaccination, VaccinationStatus
        from app.models.patient import Patient
        from app.models.user import User
        from app.core.config import settings
        from sqlalchemy import select, and_
        
        # Calculate reminder window
        today = date.today()
        reminder_date = today + timedelta(days=settings.VACCINATION_REMINDER_DAYS)
        
        reminders_sent = 0
        errors = []
        
        async with AsyncSessionLocal() as db:
            # Get vaccinations that need reminders
            stmt = select(Vaccination).join(Patient).join(User).where(
                and_(
                    Vaccination.scheduled_date <= reminder_date,
                    Vaccination.status == VaccinationStatus.SCHEDULED,
                    Vaccination.reminder_sent == False,
                )
            )
            
            result = await db.execute(stmt)
            vaccinations = result.scalars().all()
            
            # Group by patient to send one email per patient
            patient_vaccinations = {}
            for vaccination in vaccinations:
                patient_id = vaccination.patient_id
                if patient_id not in patient_vaccinations:
                    patient_vaccinations[patient_id] = []
                patient_vaccinations[patient_id].append(vaccination)
            
            for patient_id, patient_vaccines in patient_vaccinations.items():
                try:
                    patient = patient_vaccines[0].patient
                    parent = patient.parent
                    
                    # Create vaccination list for email
                    vaccine_list = []
                    for vaccine in patient_vaccines:
                        vaccine_list.append({
                            "name": vaccine.vaccine_name,
                            "due_date": vaccine.scheduled_date.strftime("%Y-%m-%d"),
                            "dose": vaccine.dose_number,
                        })
                    
                    # Send vaccination reminder email
                    from app.tasks.email import send_email_task
                    send_email_task.delay(
                        to_email=parent.email,
                        subject=f"Vaccination Reminder - {patient.full_name}",
                        html_content=render_vaccination_reminder_email(
                            parent.full_name,
                            patient.full_name,
                            vaccine_list,
                        ),
                    )
                    
                    # Mark reminders as sent
                    for vaccine in patient_vaccines:
                        vaccine.reminder_sent = True
                    
                    reminders_sent += 1
                    
                except Exception as e:
                    errors.append({
                        "patient_id": str(patient_id),
                        "error": str(e),
                    })
                    logger.error("Failed to send vaccination reminder", 
                               patient_id=patient_id, error=str(e))
            
            # Commit changes
            await db.commit()
        
        result = {
            "reminders_sent": reminders_sent,
            "errors": errors,
            "total_patients": len(patient_vaccinations),
        }
        
        logger.info("Vaccination reminders processed", **result)
        return result
        
    except Exception as e:
        logger.error("Failed to process vaccination reminders", error=str(e))
        raise


@celery_app.task(bind=True)
def send_birthday_reminders(self) -> Dict[str, Any]:
    """
    Send birthday reminders for patients.
    
    This task runs daily and sends birthday wishes to patients
    whose birthday is today.
    
    Returns:
        Dict with task results
    """
    try:
        from app.core.database import AsyncSessionLocal
        from app.models.patient import Patient
        from app.models.user import User
        from sqlalchemy import select, and_, extract
        
        today = date.today()
        reminders_sent = 0
        errors = []
        
        async with AsyncSessionLocal() as db:
            # Get patients with birthdays today
            stmt = select(Patient).join(User).where(
                and_(
                    extract('month', Patient.date_of_birth) == today.month,
                    extract('day', Patient.date_of_birth) == today.day,
                )
            )
            
            result = await db.execute(stmt)
            patients = result.scalars().all()
            
            for patient in patients:
                try:
                    parent = patient.parent
                    
                    # Calculate age
                    age_years = today.year - patient.date_of_birth.year
                    if today < patient.date_of_birth.replace(year=today.year):
                        age_years -= 1
                    
                    # Send birthday email
                    from app.tasks.email import send_email_task
                    send_email_task.delay(
                        to_email=parent.email,
                        subject=f"Happy Birthday {patient.first_name}! 🎉",
                        html_content=render_birthday_email(
                            parent.full_name,
                            patient.first_name,
                            age_years,
                        ),
                    )
                    
                    reminders_sent += 1
                    
                except Exception as e:
                    errors.append({
                        "patient_id": str(patient.id),
                        "error": str(e),
                    })
                    logger.error("Failed to send birthday reminder", 
                               patient_id=patient.id, error=str(e))
        
        result = {
            "birthday_wishes_sent": reminders_sent,
            "errors": errors,
            "total_birthdays": len(patients),
        }
        
        logger.info("Birthday reminders processed", **result)
        return result
        
    except Exception as e:
        logger.error("Failed to process birthday reminders", error=str(e))
        raise


@celery_app.task(bind=True)
def process_notification(
    self,
    notification_id: str,
    channel: str = "email",
) -> Dict[str, Any]:
    """
    Process a single notification.
    
    Args:
        notification_id: ID of notification to process
        channel: Notification channel (email, sms, push)
        
    Returns:
        Dict with processing results
    """
    try:
        from app.core.database import AsyncSessionLocal
        from app.models.notification import Notification, NotificationStatus
        from sqlalchemy import select
        from uuid import UUID
        
        async with AsyncSessionLocal() as db:
            # Get notification
            stmt = select(Notification).where(Notification.id == UUID(notification_id))
            result = await db.execute(stmt)
            notification = result.scalar_one_or_none()
            
            if not notification:
                raise ValueError(f"Notification {notification_id} not found")
            
            if notification.status != NotificationStatus.PENDING:
                return {
                    "success": False,
                    "message": f"Notification already processed: {notification.status.value}",
                }
            
            try:
                if channel == "email":
                    # Send email notification
                    from app.tasks.email import send_email_task
                    result = send_email_task.delay(
                        to_email=notification.recipient_email,
                        subject=notification.subject,
                        html_content=notification.body,
                    ).get()
                    
                    if result.get("success"):
                        notification.mark_sent()
                    else:
                        notification.mark_failed(result.get("error", "Unknown error"))
                
                elif channel == "sms":
                    # Send SMS notification
                    # TODO: Implement SMS sending
                    notification.mark_sent("SMS not implemented yet")
                
                elif channel == "push":
                    # Send push notification
                    # TODO: Implement push notifications
                    notification.mark_sent("Push notifications not implemented yet")
                
                else:
                    raise ValueError(f"Unsupported channel: {channel}")
                
                await db.commit()
                
                return {
                    "success": True,
                    "notification_id": notification_id,
                    "status": notification.status.value,
                }
                
            except Exception as e:
                notification.mark_failed(str(e))
                await db.commit()
                raise
        
    except Exception as e:
        logger.error("Failed to process notification", 
                   notification_id=notification_id, error=str(e))
        raise


def render_vaccination_reminder_email(
    parent_name: str, 
    patient_name: str, 
    vaccines: List[Dict[str, Any]]
) -> str:
    """Render vaccination reminder email HTML."""
    vaccine_list_html = ""
    for vaccine in vaccines:
        vaccine_list_html += f"""
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">{vaccine['name']}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">Dose {vaccine['dose']}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">{vaccine['due_date']}</td>
        </tr>
        """
    
    return f"""
    <html>
    <body>
        <h1>Vaccination Reminder</h1>
        <p>Hello {parent_name},</p>
        <p>{patient_name} has upcoming vaccinations that are due:</p>
        
        <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Vaccine</th>
                    <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Dose</th>
                    <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Due Date</th>
                </tr>
            </thead>
            <tbody>
                {vaccine_list_html}
            </tbody>
        </table>
        
        <p>Please schedule an appointment to ensure {patient_name} stays up to date with vaccinations.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        
        <br>
        <p>Best regards,</p>
        <p>{settings.CLINIC_NAME}</p>
        <p>{settings.CLINIC_PHONE}</p>
    </body>
    </html>
    """


def render_birthday_email(parent_name: str, patient_name: str, age: int) -> str:
    """Render birthday email HTML."""
    return f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 2.5em;">🎉</h1>
                <h1 style="margin: 10px 0;">Happy {age}{'st' if age == 1 else 'nd' if age == 2 else 'rd' if age == 3 else 'th'} Birthday!</h1>
                <h2 style="margin: 10px 0; font-weight: normal;">{patient_name}</h2>
            </div>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <p>Dear {parent_name},</p>
                <p>We wanted to take a moment to wish {patient_name} a very happy {age}{'st' if age == 1 else 'nd' if age == 2 else 'rd' if age == 3 else 'th'} birthday! 🎂</p>
                <p>It's been wonderful watching {patient_name} grow and develop. We hope this new year brings lots of joy, laughter, and continued good health.</p>
            </div>
            
            <div style="background: #e8f4fd; padding: 20px; border-radius: 10px; border-left: 4px solid #2196F3;">
                <h3 style="margin-top: 0; color: #1976D2;">Health Reminder</h3>
                <p>As {patient_name} grows, it's a good time to:</p>
                <ul>
                    <li>Schedule their annual check-up if due</li>
                    <li>Review vaccination schedule</li>
                    <li>Update any emergency contact information</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <p>Wishing {patient_name} a fantastic birthday and a healthy year ahead!</p>
                <br>
                <p style="color: #666;">
                    Best regards,<br>
                    <strong>{settings.CLINIC_NAME}</strong><br>
                    {settings.CLINIC_PHONE}
                </p>
            </div>
        </div>
    </body>
    </html>
    """