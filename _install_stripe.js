const { execFileSync } = require('child_process');
const npmCmd = 'C:\\Program Files\\nodejs\\npm.cmd';
execFileSync(npmCmd, ['install', 'stripe', '@stripe/stripe-js'], {
  cwd: 'C:\\Users\\刘\\Desktop\\lingshu-app',
  stdio: 'inherit',
  shell: false,
  env: { ...process.env }
});
