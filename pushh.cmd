@echo off
cd /d D:\Projects\lingshu-app
git push https://github.com/liumengjunyu-eng/lingshu-app.git HEAD:main 2>&1
echo ---- exit code: %errorlevel% ----
timeout /t 3 >nul
