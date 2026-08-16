@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build_gearmotor_scene.ps1" %*
set EXITCODE=%ERRORLEVEL%
if not "%EXITCODE%"=="0" (
  echo.
  echo Build gagal dengan exit code %EXITCODE%.
)
exit /b %EXITCODE%
