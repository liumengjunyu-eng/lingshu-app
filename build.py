import subprocess
import sys

result = subprocess.run(
    [r"C:\Program Files\nodejs\npm.cmd", "run", "build"],
    cwd=r"D:\Projects\lingshu-app",
    capture_output=True,
    text=True,
    encoding='utf-8',
    errors='ignore'
)

print("STDOUT:")
print(result.stdout)
print("\nSTDERR:")
print(result.stderr)
print(f"\nReturn code: {result.returncode}")
