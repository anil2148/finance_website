const { cpSync, existsSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const source = join(root, 'node_modules', '@pdftron', 'webviewer', 'public');
const target = join(root, 'public', 'webviewer');

if (!existsSync(source)) {
  console.warn('[webviewer-assets] Apryse WebViewer assets were not found. Run npm install before building the PDF editor.');
  process.exit(0);
}

mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });
console.log('[webviewer-assets] Copied Apryse WebViewer assets to public/webviewer.');
