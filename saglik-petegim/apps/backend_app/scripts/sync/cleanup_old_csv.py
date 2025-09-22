#!/usr/bin/env python3
"""
Cleanup script for Bulut Klinik CSV files
Keeps only the latest timestamped file for each data type and the _latest.csv versions
"""

import os
import sys
from pathlib import Path
import re
from datetime import datetime
import logging
import argparse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def cleanup_csv_files(data_dir: str, keep_count: int = 1):
    """
    Clean up old CSV files, keeping only the most recent timestamped versions
    
    Args:
        data_dir: Directory containing CSV files
        keep_count: Number of timestamped versions to keep for each data type (default: 1)
    """
    data_path = Path(data_dir)
    
    if not data_path.exists():
        logger.error(f"Data directory does not exist: {data_dir}")
        return False
    
    # Pattern to match timestamped CSV files
    # Format: {datatype}_{YYYYMMDD_HHMMSS}.csv
    timestamp_pattern = re.compile(r'^(.+?)_(\d{8}_\d{6})\.csv$')
    
    # Dictionary to store files by data type
    files_by_type = {}
    
    # Scan all CSV files
    for csv_file in data_path.glob("*.csv"):
        filename = csv_file.name
        
        # Skip _latest.csv files - always keep these
        if filename.endswith("_latest.csv"):
            logger.debug(f"Keeping latest file: {filename}")
            continue
        
        # Check if it's a timestamped file
        match = timestamp_pattern.match(filename)
        if match:
            data_type = match.group(1)
            timestamp = match.group(2)
            
            if data_type not in files_by_type:
                files_by_type[data_type] = []
            
            files_by_type[data_type].append({
                'path': csv_file,
                'timestamp': timestamp,
                'filename': filename
            })
    
    # Process each data type
    total_deleted = 0
    total_kept = 0
    
    for data_type, files in files_by_type.items():
        # Sort files by timestamp (newest first)
        files.sort(key=lambda x: x['timestamp'], reverse=True)
        
        logger.info(f"Processing {data_type}: {len(files)} timestamped files found")
        
        # Keep the specified number of most recent files
        for i, file_info in enumerate(files):
            if i < keep_count:
                logger.info(f"  Keeping: {file_info['filename']}")
                total_kept += 1
            else:
                # Delete older files
                try:
                    file_info['path'].unlink()
                    logger.info(f"  Deleted: {file_info['filename']}")
                    total_deleted += 1
                except Exception as e:
                    logger.error(f"  Failed to delete {file_info['filename']}: {str(e)}")
    
    # Summary
    logger.info(f"Cleanup completed: {total_deleted} files deleted, {total_kept} files kept")
    
    # List remaining files
    remaining_files = list(data_path.glob("*.csv"))
    logger.info(f"Total CSV files remaining: {len(remaining_files)}")
    
    return True

def main():
    """Main entry point for the cleanup script"""
    parser = argparse.ArgumentParser(description="Clean up old Bulut Klinik CSV files")
    parser.add_argument(
        "--data-dir",
        default=os.environ.get("BULUT_KLINIK_DATA_DIR", "apps/backend_app/data/bulut_klinik"),
        help="Directory containing CSV files"
    )
    parser.add_argument(
        "--keep-count",
        type=int,
        default=1,
        help="Number of timestamped versions to keep for each data type (default: 1)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be deleted without actually deleting"
    )
    
    args = parser.parse_args()
    
    if args.dry_run:
        logger.info("DRY RUN MODE - No files will be deleted")
    
    success = cleanup_csv_files(args.data_dir, args.keep_count)
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()