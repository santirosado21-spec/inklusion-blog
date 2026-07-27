import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = process.cwd();
const htmlFiles = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (['.git', 'node_modules', '.vercel'].includes(name)) continue;
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) walk(path);
    else if (extname(path) === '.html') htmlFiles.push(path);
  }
}
walk(root);
let failures = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const token of ['<title>', 'meta name="description"', '<main', '<h1', 'alt=', 'aria-label']) {
    if (!html.includes(token)) {
      console.error(`${file}: missing ${token}`);
      failures++;
    }
  }
}
console.log(`Validated ${htmlFiles.length} HTML files.`);
process.exit(failures ? 1 : 0);
