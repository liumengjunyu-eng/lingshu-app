const { execSync } = require('child_process');
execSync('npm install next-intl', { cwd: __dirname, stdio: 'inherit', shell: 'cmd.exe' });
