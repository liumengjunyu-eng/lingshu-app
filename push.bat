@echo off
cd /d D:\Projects\lingshu-app
git add lib/symbol/v3/deepReport.ts
git commit -m "fix: rewrite deepReport.ts with proper hook type definition"
git push origin main
pause
