"""
Monitoring Dashboard for Sync System
Provides real-time status and analytics
"""

import json
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any
import firebase_admin
from firebase_admin import credentials, firestore

class MonitoringDashboard:
    """Dashboard for monitoring sync system health and statistics"""
    
    def __init__(self):
        self.base_path = Path(__file__).parent.parent.parent
        self.sync_dir = self.base_path / 'data' / 'sync'
        self.status_file = self.sync_dir / 'status' / 'latest_sync.json'
        
        # Initialize Firebase
        self._initialize_firebase()
    
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        try:
            firebase_admin.get_app()
        except:
            cred_path = self.base_path.parent / 'flutter_app' / 'saglikpetegim-firebase-adminsdk-fbsvc-c6a289df06.json'
            cred = credentials.Certificate(str(cred_path))
            firebase_admin.initialize_app(cred)
        
        self.db = firestore.client()
    
    def get_sync_status(self) -> Dict[str, Any]:
        """Get current sync status"""
        if not self.status_file.exists():
            return {
                'status': 'No sync data available',
                'last_sync': None
            }
        
        with open(self.status_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def get_sync_history(self, days: int = 7) -> List[Dict[str, Any]]:
        """Get sync history for the last N days"""
        history = []
        status_dir = self.sync_dir / 'status'
        
        cutoff_date = datetime.now() - timedelta(days=days)
        
        for status_file in sorted(status_dir.glob('sync_*.json')):
            try:
                # Parse date from filename
                date_str = status_file.stem.replace('sync_', '')
                file_date = datetime.strptime(date_str[:8], '%Y%m%d')
                
                if file_date >= cutoff_date:
                    with open(status_file, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        history.append(data)
            except:
                continue
        
        return history
    
    def get_database_stats(self) -> Dict[str, int]:
        """Get current database statistics"""
        stats = {}
        
        try:
            # Count documents in each collection
            collections = ['users', 'patients', 'appointments', 'health_records', 'vaccinations']
            
            for collection in collections:
                docs = self.db.collection(collection).get()
                stats[collection] = len(docs)
        except Exception as e:
            print(f"Error getting database stats: {e}")
        
        return stats
    
    def get_sync_metrics(self) -> Dict[str, Any]:
        """Calculate sync performance metrics"""
        history = self.get_sync_history(30)
        
        if not history:
            return {
                'total_syncs': 0,
                'success_rate': 0,
                'avg_duration': 0,
                'total_added': 0,
                'total_updated': 0,
                'total_errors': 0
            }
        
        total_syncs = len(history)
        successful_syncs = sum(1 for h in history if h.get('status') == 'completed')
        
        total_duration = 0
        total_added = 0
        total_updated = 0
        total_errors = 0
        
        for sync in history:
            # Calculate duration
            if 'start_time' in sync and 'end_time' in sync:
                start = datetime.fromisoformat(sync['start_time'])
                end = datetime.fromisoformat(sync['end_time'])
                total_duration += (end - start).total_seconds()
            
            # Sum statistics
            if 'statistics' in sync:
                total_added += sync['statistics'].get('added', 0)
                total_updated += sync['statistics'].get('updated', 0)
                total_errors += sync['statistics'].get('errors', 0)
        
        return {
            'total_syncs': total_syncs,
            'success_rate': (successful_syncs / total_syncs * 100) if total_syncs > 0 else 0,
            'avg_duration': total_duration / total_syncs if total_syncs > 0 else 0,
            'total_added': total_added,
            'total_updated': total_updated,
            'total_errors': total_errors
        }
    
    def check_system_health(self) -> Dict[str, Any]:
        """Check overall system health"""
        health = {
            'status': 'healthy',
            'issues': []
        }
        
        # Check last sync time
        status = self.get_sync_status()
        if status.get('end_time'):
            last_sync = datetime.fromisoformat(status['end_time'])
            time_since_sync = datetime.now() - last_sync
            
            if time_since_sync > timedelta(hours=2):
                health['status'] = 'warning'
                health['issues'].append(f"No sync in {time_since_sync.total_seconds() / 3600:.1f} hours")
        
        # Check error rate
        metrics = self.get_sync_metrics()
        if metrics['success_rate'] < 90:
            health['status'] = 'critical' if metrics['success_rate'] < 50 else 'warning'
            health['issues'].append(f"Low success rate: {metrics['success_rate']:.1f}%")
        
        # Check Firebase connection
        try:
            self.db.collection('users').limit(1).get()
        except:
            health['status'] = 'critical'
            health['issues'].append("Firebase connection failed")
        
        # Check disk space for logs
        log_dir = self.sync_dir / 'logs'
        if log_dir.exists():
            log_size = sum(f.stat().st_size for f in log_dir.glob('*.log'))
            if log_size > 100 * 1024 * 1024:  # 100 MB
                health['status'] = 'warning' if health['status'] == 'healthy' else health['status']
                health['issues'].append(f"Log files using {log_size / 1024 / 1024:.1f} MB")
        
        return health
    
    def generate_report(self) -> str:
        """Generate a comprehensive status report"""
        report = []
        report.append("=" * 60)
        report.append("SAGLIK PETEGIM SYNC SYSTEM MONITORING REPORT")
        report.append("=" * 60)
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("")
        
        # Current Status
        status = self.get_sync_status()
        report.append("CURRENT STATUS:")
        report.append("-" * 40)
        if status.get('end_time'):
            report.append(f"Last Sync: {status['end_time']}")
            report.append(f"Status: {status.get('status', 'Unknown')}")
            if 'statistics' in status:
                stats = status['statistics']
                report.append(f"  Added: {stats.get('added', 0)}")
                report.append(f"  Updated: {stats.get('updated', 0)}")
                report.append(f"  Errors: {stats.get('errors', 0)}")
        else:
            report.append("No sync data available")
        report.append("")
        
        # Database Statistics
        db_stats = self.get_database_stats()
        report.append("DATABASE STATISTICS:")
        report.append("-" * 40)
        for collection, count in db_stats.items():
            report.append(f"{collection}: {count} documents")
        report.append("")
        
        # Sync Metrics (30 days)
        metrics = self.get_sync_metrics()
        report.append("SYNC METRICS (Last 30 Days):")
        report.append("-" * 40)
        report.append(f"Total Syncs: {metrics['total_syncs']}")
        report.append(f"Success Rate: {metrics['success_rate']:.1f}%")
        report.append(f"Average Duration: {metrics['avg_duration']:.1f} seconds")
        report.append(f"Total Added: {metrics['total_added']}")
        report.append(f"Total Updated: {metrics['total_updated']}")
        report.append(f"Total Errors: {metrics['total_errors']}")
        report.append("")
        
        # System Health
        health = self.check_system_health()
        report.append("SYSTEM HEALTH:")
        report.append("-" * 40)
        report.append(f"Status: {health['status'].upper()}")
        if health['issues']:
            report.append("Issues:")
            for issue in health['issues']:
                report.append(f"  - {issue}")
        else:
            report.append("No issues detected")
        report.append("")
        
        report.append("=" * 60)
        
        return "\n".join(report)
    
    def save_report(self, filename: str = None):
        """Save report to file"""
        if filename is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"monitoring_report_{timestamp}.txt"
        
        report_path = self.sync_dir / 'reports' / filename
        report_path.parent.mkdir(parents=True, exist_ok=True)
        
        report = self.generate_report()
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"Report saved to: {report_path}")
        return report_path


def main():
    """Main entry point for CLI usage"""
    dashboard = MonitoringDashboard()
    
    print(dashboard.generate_report())
    
    # Save report
    dashboard.save_report()
    
    # Interactive mode
    while True:
        print("\nOptions:")
        print("1. View current status")
        print("2. View sync history")
        print("3. View database stats")
        print("4. View sync metrics")
        print("5. Check system health")
        print("6. Generate full report")
        print("7. Save report to file")
        print("0. Exit")
        
        choice = input("\nSelect option: ")
        
        if choice == '0':
            break
        elif choice == '1':
            status = dashboard.get_sync_status()
            print(json.dumps(status, indent=2))
        elif choice == '2':
            days = int(input("Number of days (default 7): ") or "7")
            history = dashboard.get_sync_history(days)
            print(f"Found {len(history)} sync records")
            for h in history[-5:]:  # Show last 5
                print(f"  {h.get('end_time', 'Unknown')} - {h.get('status', 'Unknown')}")
        elif choice == '3':
            stats = dashboard.get_database_stats()
            for collection, count in stats.items():
                print(f"{collection}: {count}")
        elif choice == '4':
            metrics = dashboard.get_sync_metrics()
            for key, value in metrics.items():
                print(f"{key}: {value}")
        elif choice == '5':
            health = dashboard.check_system_health()
            print(f"Status: {health['status']}")
            if health['issues']:
                print("Issues:")
                for issue in health['issues']:
                    print(f"  - {issue}")
        elif choice == '6':
            print(dashboard.generate_report())
        elif choice == '7':
            dashboard.save_report()
        else:
            print("Invalid option")


if __name__ == '__main__':
    main()