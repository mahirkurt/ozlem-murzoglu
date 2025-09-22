"""Celery configuration for background tasks."""

import structlog
from celery import Celery
from celery.schedules import crontab
from kombu import Queue

from app.core.config import settings

logger = structlog.get_logger()

# Create Celery instance
celery_app = Celery(
    "saglik_petegim",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

# Celery configuration
celery_app.conf.update(
    # General settings
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone=settings.CELERY_TIMEZONE,
    enable_utc=True,
    
    # Task settings
    task_always_eager=settings.CELERY_TASK_ALWAYS_EAGER,
    task_eager_propagates=True,
    task_ignore_result=False,
    task_track_started=True,
    task_time_limit=300,  # 5 minutes
    task_soft_time_limit=240,  # 4 minutes
    
    # Worker settings
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
    worker_disable_rate_limits=False,
    
    # Result backend settings
    result_expires=3600,  # 1 hour
    result_backend_transport_options={
        "master_name": "mymaster",
    },
    
    # Route tasks to specific queues
    task_routes={
        "app.tasks.email.*": {"queue": "email"},
        "app.tasks.sms.*": {"queue": "sms"},
        "app.tasks.notifications.*": {"queue": "notifications"},
        "app.tasks.reports.*": {"queue": "reports"},
        "app.tasks.maintenance.*": {"queue": "maintenance"},
    },
    
    # Define queues
    task_default_queue="default",
    task_queues=(
        Queue("default", routing_key="default"),
        Queue("email", routing_key="email"),
        Queue("sms", routing_key="sms"), 
        Queue("notifications", routing_key="notifications"),
        Queue("reports", routing_key="reports"),
        Queue("maintenance", routing_key="maintenance"),
        Queue("priority", routing_key="priority"),
    ),
    
    # Beat schedule for periodic tasks
    beat_schedule={
        # Send appointment reminders every hour
        "send-appointment-reminders": {
            "task": "app.tasks.notifications.send_appointment_reminders",
            "schedule": crontab(minute=0),  # Every hour at minute 0
        },
        
        # Send vaccination reminders daily at 9 AM
        "send-vaccination-reminders": {
            "task": "app.tasks.notifications.send_vaccination_reminders", 
            "schedule": crontab(hour=9, minute=0),  # Daily at 9:00 AM
        },
        
        # Check overdue appointments daily at 10 AM
        "check-overdue-appointments": {
            "task": "app.tasks.appointments.check_overdue_appointments",
            "schedule": crontab(hour=10, minute=0),  # Daily at 10:00 AM
        },
        
        # Generate daily reports at midnight
        "generate-daily-reports": {
            "task": "app.tasks.reports.generate_daily_report",
            "schedule": crontab(hour=0, minute=0),  # Daily at midnight
        },
        
        # Clean up old notifications weekly
        "cleanup-old-notifications": {
            "task": "app.tasks.maintenance.cleanup_old_notifications",
            "schedule": crontab(day_of_week=0, hour=2, minute=0),  # Weekly on Sunday at 2:00 AM
        },
        
        # Database maintenance weekly
        "database-maintenance": {
            "task": "app.tasks.maintenance.database_maintenance",
            "schedule": crontab(day_of_week=0, hour=3, minute=0),  # Weekly on Sunday at 3:00 AM
        },
        
        # Send birthday reminders daily at 8 AM
        "send-birthday-reminders": {
            "task": "app.tasks.notifications.send_birthday_reminders",
            "schedule": crontab(hour=8, minute=0),  # Daily at 8:00 AM
        },
        
        # Update growth percentiles daily at 6 AM
        "update-growth-percentiles": {
            "task": "app.tasks.growth.update_growth_percentiles",
            "schedule": crontab(hour=6, minute=0),  # Daily at 6:00 AM
        },
    },
)

# Auto-discover tasks from all apps
celery_app.autodiscover_tasks([
    "app.tasks.email",
    "app.tasks.sms",
    "app.tasks.notifications",
    "app.tasks.appointments",
    "app.tasks.reports",
    "app.tasks.maintenance",
    "app.tasks.growth",
])


# Task failure handler
@celery_app.task(bind=True)
def debug_task(self):
    """Debug task for testing Celery setup."""
    logger.info("Celery debug task executed", request_id=self.request.id)
    return f"Request: {self.request!r}"


# Custom task base class with logging
class LoggedTask(celery_app.Task):
    """Base task class with automatic logging."""
    
    def on_success(self, retval, task_id, args, kwargs):
        """Called on task success."""
        logger.info(
            "Task completed successfully",
            task_id=task_id,
            task_name=self.name,
            result=str(retval)[:200],  # Limit result length in logs
        )
    
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """Called on task failure."""
        logger.error(
            "Task failed",
            task_id=task_id,
            task_name=self.name,
            error=str(exc),
            traceback=str(einfo),
            args=args,
            kwargs=kwargs,
        )
    
    def on_retry(self, exc, task_id, args, kwargs, einfo):
        """Called on task retry."""
        logger.warning(
            "Task retry",
            task_id=task_id,
            task_name=self.name,
            error=str(exc),
            retry_count=self.request.retries,
        )


# Set default task base
celery_app.Task = LoggedTask


def create_celery_app():
    """Create and configure Celery app."""
    logger.info(
        "Celery app created",
        broker=settings.CELERY_BROKER_URL,
        backend=settings.CELERY_RESULT_BACKEND,
        timezone=settings.CELERY_TIMEZONE,
    )
    return celery_app


# Health check task
@celery_app.task(name="health_check")
def health_check():
    """Health check task for monitoring."""
    try:
        from datetime import datetime
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "worker_id": health_check.request.id,
        }
    except Exception as e:
        logger.error("Health check failed", error=str(e))
        raise


if __name__ == "__main__":
    # Start Celery worker if run directly
    celery_app.start()