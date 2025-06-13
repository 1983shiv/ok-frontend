@echo off
echo.
echo ============================================
echo   Backend API Diagnostic Test
echo ============================================
echo.

cd /d "%~dp0"

echo Running comprehensive endpoint tests...
echo.

node diagnostic-test.js

echo.
echo ============================================
echo   Test Complete
echo ============================================
echo.
pause
