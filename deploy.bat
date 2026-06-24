@echo off
chcp 65001 >nul
cd /d "C:\Users\刘\Desktop\lingshu-app"
echo Adding files...
git add .
echo Committing...
git commit -m "fix: lazy load Stripe to fix build error"
echo Pushing to GitHub...
git push origin main
echo Done!
pause
