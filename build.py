import subprocess, os
env_clean = {}
for k, v in os.environ.items():
     if ')' not in k and ')' not in v:
         env_clean[k] = v
r = subprocess.run(['D:\\Projects\\lingshu-app\\node_modules\\.bin\\next.cmd', 'build'], cwd='D:/Projects/lingshu-app', env=env_clean, shell=False)
exit(r.returncode)
