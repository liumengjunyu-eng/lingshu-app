@echo off
cd /d "D:\Projects\lingshu-app"
git add app/deep-report/page.tsx
git status
git commit -m "fix: use BaziResult field names correctly in deep-report"
git log --oneline -3
