$projectDir = "D:\Projects\lingshu-app"
Set-Location $projectDir
$env:DEEPSEEK_API_KEY = "sk-9dbe8f90c812418b975a26cbcdd7e48e"
$process = Start-Process -FilePath "npx.cmd" -ArgumentList "next build" -WorkingDirectory $projectDir -NoNewWindow -RedirectStandardOutput "$projectDir\_build.log" -RedirectStandardError "$projectDir\_build.log" -Wait
Write-Output "=== BUILD DONE ==="
Get-Content "$projectDir\_build.log" -Tail 20
