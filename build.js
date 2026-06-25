const { spawnSync } = require('child_process');
const path = require('path');
const result = spawnSync(
  path.join('D:', 'Projects', 'lingshu-app', 'node_modules', '.bin', 'next.cmd'),
  ['build'],
  {
    cwd: 'D:/Projects/lingshu-app',
    stdio: 'inherit',
    shell: false,
    env: {
      PATH: process.env.PATH || '',
      NODE_ENV: 'production',
    },
  }
);
process.exit(result.status === null ? 1 : result.status);
