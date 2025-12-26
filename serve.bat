@echo off
echo Starting GreatDepression2.com local server...
echo.
echo The website will be available at:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Try Python 3 first
python -m http.server 8000 2>nul

REM If Python 3 fails, try Python 2
if errorlevel 1 (
    python -m SimpleHTTPServer 8000 2>nul
)

REM If both fail, show error
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo.
    echo Please install Python or use another method to serve the files.
    echo See README.md for alternative options.
    pause
)
