import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'node_modules', '@pdftron', 'webviewer', 'public');
const target = join(root, 'public', 'webviewer');

if (!existsSync(source)) {
  console.warn('WebViewer assets not found. Run npm install first.');
  process.exit(0);
}

mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });
console.log('Copied Apryse WebViewer assets to public/webviewer');
