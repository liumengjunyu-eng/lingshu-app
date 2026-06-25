Set-Location "D:\Projects\lingshu-app"
node node_modules\next\dist\bin\next build 2>&1 | Select-Object -Last 40
