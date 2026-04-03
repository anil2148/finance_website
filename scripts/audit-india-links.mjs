import fs from 'node:fs';

const checks = [
  { file: 'app/in/layout.tsx', mustInclude: ['india-content'] },
  { file: 'app/in/page.tsx', mustInclude: ['IndiaHomepageLayout'] },
  { file: 'app/in/blog/page.tsx', mustInclude: ['content-link', 'IndiaAuthorityNote'] },
  { file: 'app/in/blog/sip-vs-fd/page.tsx', mustInclude: ['india-link-cluster', 'content-link'] },
  { file: 'app/in/blog/ppf-vs-elss/page.tsx', mustInclude: ['india-link-cluster', 'content-link'] },
  { file: 'styles/globals.css', mustInclude: ['.india-content', '.content-link', '.india-link-cluster'] }
];

const failures = [];
for (const check of checks) {
  if (!fs.existsSync(check.file)) {
    failures.push(`[missing-file] ${check.file}`);
    continue;
  }
  const text = fs.readFileSync(check.file, 'utf8');
  for (const token of check.mustInclude) {
    if (!text.includes(token)) {
      failures.push(`[missing-token] ${check.file} :: ${token}`);
    }
  }
}

if (failures.length) {
  console.error('India link audit failed:');
  failures.forEach((f) => console.error(`- ${f}`));
  process.exit(1);
}

console.log(`India link audit passed (${checks.length} regression checkpoints).`);
