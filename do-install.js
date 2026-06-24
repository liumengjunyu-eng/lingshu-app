const { execSync } = require('child_process');
const projectDir = 'C:\\Users\\刘\\Desktop\\lingshu-app';
console.log('Working directory:', projectDir);
try {
  const result = execSync('npm install lunar-javascript', {
    cwd: projectDir,
    encoding: 'utf8'
  });
  console.log(String(result));
  console.log('SUCCESS');
} catch(e) {
  console.error('FAILED:', String(e.stderr || e.message));
  process.exit(1);
}
