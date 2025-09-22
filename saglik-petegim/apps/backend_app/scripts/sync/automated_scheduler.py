"""
Automated Scheduler for Data Pipeline
Manages periodic synchronization between Bulut Klinik and Firestore
"""

import schedule
import time
import logging
from datetime import datetime
from pathlib import Path
import threading
import signal
import sys
from typing import Optional

from dynamic_sync_manager import DynamicSyncManager
from realtime_listener import RealtimeListener

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('data/sync/logs/scheduler.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class AutomatedScheduler:
    """Manages automated synchronization tasks"""
    
    def __init__(self):
        self.sync_manager = DynamicSyncManager()
        self.realtime_listener = RealtimeListener()
        self.is_running = False
        self.sync_thread: Optional[threading.Thread] = None
        self.listener_thread: Optional[threading.Thread] = None
        
        # Register signal handlers for graceful shutdown
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
    
    def _signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        logger.info(f"Received signal {signum}, shutting down...")
        self.stop()
        sys.exit(0)
    
    def sync_task(self):
        """Execute synchronization task"""
        try:
            logger.info("Starting scheduled sync task...")
            
            # Check for changes and sync if needed
            if self.sync_manager.has_changes():
                logger.info("Changes detected, running sync...")
                results = self.sync_manager.sync()
                
                # Log results
                logger.info(f"Sync completed - Added: {results['added']}, "
                          f"Updated: {results['updated']}, "
                          f"Errors: {results['errors']}")
                
                # Send notification if there were significant changes
                if results['added'] > 0 or results['updated'] > 0:
                    self._notify_changes(results)
            else:
                logger.info("No changes detected, skipping sync")
                
        except Exception as e:
            logger.error(f"Error in sync task: {e}")
    
    def quick_check_task(self):
        """Quick check for urgent updates"""
        try:
            logger.debug("Running quick check for urgent updates...")
            
            # Check for appointments in next 24 hours
            appointments_to_sync = self.sync_manager._check_urgent_appointments()
            
            if appointments_to_sync:
                logger.info(f"Found {len(appointments_to_sync)} urgent appointments to sync")
                self.sync_manager._sync_urgent_appointments(appointments_to_sync)
                
        except Exception as e:
            logger.error(f"Error in quick check task: {e}")
    
    def cleanup_task(self):
        """Clean up old logs and temporary files"""
        try:
            logger.info("Running cleanup task...")
            
            # Clean old log files (older than 30 days)
            log_dir = Path('data/sync/logs')
            cutoff_date = datetime.now().timestamp() - (30 * 24 * 60 * 60)
            
            for log_file in log_dir.glob('*.log'):
                if log_file.stat().st_mtime < cutoff_date:
                    log_file.unlink()
                    logger.info(f"Deleted old log file: {log_file}")
            
            # Clean old status files
            status_dir = Path('data/sync/status')
            for status_file in status_dir.glob('sync_*.json'):
                if status_file.stat().st_mtime < cutoff_date:
                    status_file.unlink()
                    logger.info(f"Deleted old status file: {status_file}")
                    
        except Exception as e:
            logger.error(f"Error in cleanup task: {e}")
    
    def health_check_task(self):
        """Perform system health check"""
        try:
            logger.debug("Running health check...")
            
            # Check Firebase connection
            if not self.sync_manager._check_firebase_connection():
                logger.error("Firebase connection is down!")
                self._notify_error("Firebase connection lost")
            
            # Check data directories
            required_dirs = [
                'data/raw/bulut_klinik',
                'data/processed/current',
                'data/sync/logs'
            ]
            
            for dir_path in required_dirs:
                if not Path(dir_path).exists():
                    logger.warning(f"Required directory missing: {dir_path}")
                    Path(dir_path).mkdir(parents=True, exist_ok=True)
                    
        except Exception as e:
            logger.error(f"Error in health check: {e}")
    
    def _notify_changes(self, results):
        """Send notification about sync results"""
        # This would integrate with notification service
        logger.info(f"Notification: Sync completed with {results['added']} additions "
                   f"and {results['updated']} updates")
    
    def _notify_error(self, error_msg):
        """Send error notification"""
        # This would integrate with notification service
        logger.error(f"Error notification: {error_msg}")
    
    def setup_schedule(self):
        """Configure the schedule for all tasks"""
        
        # Main sync - every 30 minutes
        schedule.every(30).minutes.do(self.sync_task)
        
        # Quick check for urgent items - every 5 minutes
        schedule.every(5).minutes.do(self.quick_check_task)
        
        # Health check - every 10 minutes
        schedule.every(10).minutes.do(self.health_check_task)
        
        # Daily cleanup at 3 AM
        schedule.every().day.at("03:00").do(self.cleanup_task)
        
        # Force full sync daily at 2 AM
        schedule.every().day.at("02:00").do(lambda: self.sync_manager.sync(force=True))
        
        logger.info("Schedule configured:")
        logger.info("  - Main sync: every 30 minutes")
        logger.info("  - Quick check: every 5 minutes")
        logger.info("  - Health check: every 10 minutes")
        logger.info("  - Cleanup: daily at 3:00 AM")
        logger.info("  - Full sync: daily at 2:00 AM")
    
    def run_schedule_loop(self):
        """Run the schedule loop"""
        while self.is_running:
            schedule.run_pending()
            time.sleep(1)
    
    def run_listener_loop(self):
        """Run the realtime listener"""
        try:
            self.realtime_listener.run_forever()
        except Exception as e:
            logger.error(f"Realtime listener error: {e}")
    
    def start(self):
        """Start the automated scheduler"""
        logger.info("Starting Automated Scheduler...")
        
        self.is_running = True
        
        # Setup schedule
        self.setup_schedule()
        
        # Run initial sync
        logger.info("Running initial sync...")
        self.sync_task()
        
        # Start schedule thread
        self.sync_thread = threading.Thread(target=self.run_schedule_loop, daemon=True)
        self.sync_thread.start()
        logger.info("Schedule thread started")
        
        # Start realtime listener thread
        self.listener_thread = threading.Thread(target=self.run_listener_loop, daemon=True)
        self.listener_thread.start()
        logger.info("Realtime listener thread started")
        
        logger.info("Automated Scheduler is running. Press Ctrl+C to stop.")
        
        # Keep main thread alive
        try:
            while self.is_running:
                time.sleep(1)
        except KeyboardInterrupt:
            self.stop()
    
    def stop(self):
        """Stop the automated scheduler"""
        logger.info("Stopping Automated Scheduler...")
        
        self.is_running = False
        
        # Stop realtime listener
        if self.realtime_listener:
            self.realtime_listener.stop_listeners()
        
        # Wait for threads to finish
        if self.sync_thread and self.sync_thread.is_alive():
            self.sync_thread.join(timeout=5)
        
        if self.listener_thread and self.listener_thread.is_alive():
            self.listener_thread.join(timeout=5)
        
        logger.info("Automated Scheduler stopped")


def main():
    """Main entry point"""
    scheduler = AutomatedScheduler()
    
    # Add extension methods to DynamicSyncManager for urgent checks
    def _check_urgent_appointments(self):
        """Check for appointments needing urgent sync"""
        # This would check for appointments in next 24 hours
        # that haven't been synced yet
        return []
    
    def _sync_urgent_appointments(self, appointments):
        """Sync urgent appointments immediately"""
        # This would sync only the urgent appointments
        pass
    
    def _check_firebase_connection(self):
        """Check if Firebase is accessible"""
        try:
            # Try a simple read operation
            self.db.collection('users').limit(1).get()
            return True
        except:
            return False
    
    # Attach methods to sync manager
    scheduler.sync_manager._check_urgent_appointments = _check_urgent_appointments.__get__(
        scheduler.sync_manager, DynamicSyncManager
    )
    scheduler.sync_manager._sync_urgent_appointments = _sync_urgent_appointments.__get__(
        scheduler.sync_manager, DynamicSyncManager
    )
    scheduler.sync_manager._check_firebase_connection = _check_firebase_connection.__get__(
        scheduler.sync_manager, DynamicSyncManager
    )
    
    # Start the scheduler
    scheduler.start()


if __name__ == '__main__':
    main()