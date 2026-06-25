const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const cwd = path.resolve('D:/Projects/lingshu-app');
const pkgPath = path.join(cwd, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

pkg.dependencies.html2canvas = '^1.4.1';
pkg.dependencies['@supabase/supabase-js'] = '^2.49.0';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// Find npm-cli.js
const nodeRoot = path.resolve(process.execPath, '..');
const npmClis = [];
const search = (dir) => {
  try {
    for (const f of fs.readdirSync(dir)) {
      const fp = path.join(dir, f);
      if (f === 'npm-cli.js') npmClis.push(fp);
      try { if (fs.statSync(fp).isDirectory()) search(fp); } catch {}
    }
  } catch {}
};
search(nodeRoot);
if (!npmClis.length) {
  // try parent dirs
  search(path.resolve(nodeRoot, '..'));
  search(path.resolve(nodeRoot, '../lib'));
}
if (!npmClis.length) {
  console.error('npm-cli.js not found under', nodeRoot);
  process.exit(1);
}
console.log('npm cli:', npmClis[0]);

const cleanEnv = {};
const SAFE = ['PATH','USERPROFILE','APPDATA','LOCALAPPDATA','TEMP','TMP','HOMEDRIVE','HOMEPATH','COMSPEC','SYSTEMDRIVE','SYSTEMROOT','PATHEXT'];
SAFE.forEach(k => { const v = process.env[k]; if (v && !v.includes('(') && !v.includes(')')) cleanEnv[k] = v; });

const r = spawnSync(process.execPath, [npmClis[0], 'install', '--save'], {
  cwd, stdio: 'inherit', shell: false, env: cleanEnv,
});
process.exit(r.status ?? 1);
