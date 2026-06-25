Set-Location "D:\Projects\lingshu-app"
npx next build 2>&1 | Select-String -Pattern "error|Error|ready|success|✓|✗|Failed|Collection|Route" | Select-Object -First 20
