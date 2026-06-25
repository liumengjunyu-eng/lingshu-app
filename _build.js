// build check - skip env vars
process.env.STRIPE_SECRET_KEY = 'sk_test_placeholder';
process.env.DEEPSEEK_API_KEY = 'sk_placeholder';
const { execSync } = require('child_process');
try {
  execSync('node_modules\\.bin\\next.cmd build', { cwd: __dirname, stdio: 'inherit', shell: 'cmd.exe' });
} catch(e) {
  process.exit(1);
}
