@echo off
cd /d C:\Users\刘\Desktop\lingshu-app
echo Installing lunar-javascript...
call npm install lunar-javascript
echo.
echo Build test...
call node node_modules\next\dist\bin\next build C:\Users\刘\Desktop\lingshu-app > build-result.txt 2>&1
echo Exit code: %ERRORLEVEL%
echo.
type build-result.txt | findstr /C:"Compiled successfully" /C:"Failed" /C:"error"
echo.
echo Done. Close this window.
pause
