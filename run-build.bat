@echo off
cd /d C:\Users\刘\Desktop\lingshu-app
call npm run build > build_output.txt 2>&1
echo Exit code: %ERRORLEVEL%
