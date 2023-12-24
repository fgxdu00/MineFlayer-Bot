@echo off

echo Press any button if you already installed NodeJS and Python
pause > nul

echo Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing Python dependencies.
    pause > nul
    exit /b %errorlevel%
)

echo Installing Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error installing Node.js dependencies.
    pause > nul
    exit /b %errorlevel%
)

echo Installation completed successfully!
pause > nul