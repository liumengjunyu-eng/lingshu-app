import subprocess
import sys

def run(cmd, cwd=None):
    print(f">>> {cmd}")
    result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    print(result.stdout)
    if result.stderr:
        print("STDERR:", result.stderr)
    return result.returncode

repo = "D:/Projects/lingshu-app"
run("git add app/deep-report/page.tsx", cwd=repo)
run('git commit -m "fix: correct Bazi import function name"', cwd=repo)
run("git push", cwd=repo)
print("Done!")
