const { execSync } = require('child_process');
const env = { ...process.env };
// Remove problematic env vars with special chars
delete env.STRIPE_SECRET_KEY;
delete env.DEEPSEEK_API_KEY;
try {
  const result = execSync('npx next build', { cwd: 'D:\\Projects\\lingshu-app', env, stdio: 'inherit' });
  console.log('Build succeeded!');
} catch (e) {
  console.error('Build failed:', e.message);
}
