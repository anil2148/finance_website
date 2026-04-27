#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const scanDirs = ['app', 'components', 'lib'];
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.mdx']);

const termPatterns = [
  { key: 'mortgage', pattern: /\bmortgage\b/gi },
  { key: 'checking_account', pattern: /\bchecking account\b/gi },
  { key: 'tax_bracket', pattern: /\btax brackets?\b/gi },
  { key: 'stocks', pattern: /\bstocks\b/gi },
  { key: 'revenue', pattern: /\brevenue\b/gi }
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    if (exts.has(path.extname(entry.name))) files.push(fullPath);
  }
  return files;
}

const results = [];
for (const relativeDir of scanDirs) {
  const dir = path.join(root, relativeDir);
  if (!fs.existsSync(dir)) continue;

  for (const file of walk(dir)) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, idx) => {
      for (const term of termPatterns) {
        if (term.pattern.test(line) && !line.includes('getTerm(') && !line.includes('terminology')) {
          results.push({
            file: path.relative(root, file),
            line: idx + 1,
            term: term.key,
            snippet: line.trim()
          });
          break;
        }
      }
    });
  }
}

if (results.length === 0) {
  console.log('No hardcoded terminology matches found.');
  process.exit(0);
}

console.log(`Found ${results.length} potential hardcoded financial terminology entries:`);
for (const match of results.slice(0, 200)) {
  console.log(`- ${match.file}:${match.line} [${match.term}] ${match.snippet}`);
}

if (results.length > 200) {
  console.log(`... ${results.length - 200} more entries omitted`);
}

if (process.argv.includes('--strict')) {
  process.exit(1);
}
