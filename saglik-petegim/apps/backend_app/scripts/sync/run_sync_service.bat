@echo off
REM Batch script to run the automated sync service
REM Can be added to Windows Task Scheduler for automatic startup

cd /d "D:\GitHub Repos\Saglik-Petegim\apps\backend_app"

echo Starting Saglik Petegim Data Sync Service...
echo ==========================================
echo.

REM Activate virtual environment if exists
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
)

REM Run the automated scheduler
python scripts\sync\automated_scheduler.py

echo.
echo Service stopped.
pause