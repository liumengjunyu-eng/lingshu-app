import subprocess
import sys
import io

# Force UTF-8 output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

result = subprocess.run(
    [r"C:\Program Files\nodejs\npm.cmd", "run", "build"],
    cwd=r"D:\Projects\lingshu-app",
    capture_output=True,
    text=True,
    encoding='utf-8',
    errors='replace'
)

print("STDOUT:")
print(result.stdout[-5000:] if len(result.stdout) > 5000 else result.stdout)
print("\nSTDERR:")
print(result.stderr[-2000:] if len(result.stderr) > 2000 else result.stderr)
print(f"\nReturn code: {result.returncode}")
