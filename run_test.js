const { execSync } = require('child_process');
try {
  execSync('npx electron .', { stdio: 'pipe', cwd: __dirname });
} catch (e) {
  console.error("STDOUT:", e.stdout && e.stdout.toString());
  console.error("STDERR:", e.stderr && e.stderr.toString());
}
