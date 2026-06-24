const { execSync } = require('child_process');
const path = require('path');

const projectDir = 'C:\\Users\\刘\\Desktop\\lingshu-app';
console.log('Installing lunar-javascript in:', projectDir);

try {
  execSync('npm install lunar-javascript', {
    cwd: projectDir,
    stdio: 'inherit',
    shell: true
  });
  console.log('✅ Install complete');
} catch (e) {
  console.error('❌ Install failed:', e.message);
  process.exit(1);
}
