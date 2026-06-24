// Run build without shell to avoid env var issues
const { spawn } = require('child_process');
const path = require('path');

// Use full node_modules path for npm
const npmPath = 'C:\\Program Files\\nodejs\\npm.cmd';
const cwd = 'C:\\Users\\刘\\Desktop\\lingshu-app';

const child = spawn(npmPath, ['run', 'build'], {
  cwd,
  stdio: 'inherit',
  shell: false,
  env: process.env
});

child.on('close', (code) => {
  process.exit(code);
});
