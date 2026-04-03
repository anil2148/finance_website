import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const requiredRoutes = [
  'app/in/page.tsx',
  'app/in/blog/page.tsx',
  'app/in/blog/sip-vs-fd/page.tsx',
  'app/in/blog/ppf-vs-elss/page.tsx',
  'app/page.tsx',
  'app/blog/page.tsx'
];

const sharedLinkTokens = [
  'content-link',
  'content-link-chip',
  'utility-link',
  'link-card',
  'btn-primary',
  'comparison-cta',
  'underline'
];

const failures = [];

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

for (const route of requiredRoutes) {
  if (!fs.existsSync(path.join(root, route))) {
    failures.push(`[missing-route-file] ${route}`);
  }
}

const breadcrumbFile = 'components/layout/Breadcrumbs.tsx';
if (!fs.existsSync(path.join(root, breadcrumbFile))) {
  failures.push('[missing-file] components/layout/Breadcrumbs.tsx');
} else {
  const breadcrumbSource = read(breadcrumbFile);
  const expectedLabels = ['Home', "'India'", "'Blog'", "'SIP vs FD'", "'PPF vs ELSS'"];

  for (const label of expectedLabels) {
    if (!breadcrumbSource.includes(label)) {
      failures.push(`[breadcrumb-label-missing] ${label}`);
    }
  }

  if (breadcrumbSource.includes('India home')) {
    failures.push('[breadcrumb-raw-label] found legacy "India home" label');
  }
}

const markdownRendererFile = 'components/blog/InteractiveArticleContent.tsx';
if (!fs.existsSync(path.join(root, markdownRendererFile))) {
  failures.push('[missing-file] components/blog/InteractiveArticleContent.tsx');
} else {
  const source = read(markdownRendererFile);
  if (!source.includes("line.startsWith('|')") || !source.includes('<table')) {
    failures.push('[markdown-table-rendering] table parsing/rendering check failed');
  }
  if (!source.includes('className="content-link"')) {
    failures.push('[markdown-link-style] InteractiveArticleContent links are not using shared link style');
  }
}

const indiaArticles = [
  'app/in/blog/sip-vs-fd/page.tsx',
  'app/in/blog/ppf-vs-elss/page.tsx'
];

for (const file of indiaArticles) {
  const source = read(file);

  if (!source.includes('<table')) {
    failures.push(`[india-article-table-missing] ${file}`);
  }

  const linkMatches = [...source.matchAll(/<Link\b([^>]*?)>/g)];
  for (const match of linkMatches) {
    const attrs = match[1] ?? '';
    const classMatch = attrs.match(/className=(?:"([^"]+)"|'([^']+)')/);
    const classValue = classMatch?.[1] ?? classMatch?.[2] ?? '';

    if (!classValue) {
      failures.push(`[missing-link-class] ${file} :: ${match[0]}`);
      continue;
    }

    const hasSharedToken = sharedLinkTokens.some((token) => classValue.includes(token));
    const isIntentionalButtonOrCard = classValue.includes('rounded-') || classValue.includes('bg-');

    if (!hasSharedToken && !isIntentionalButtonOrCard) {
      failures.push(`[unshared-link-style] ${file} :: ${match[0]}`);
    }
  }

  if (/<\/Link>\s*<Link\b/.test(source) && !source.includes('india-link-cluster') && !source.includes('inline-link-row') && !source.includes('gap-')) {
    failures.push(`[adjacent-links-without-spacing] ${file}`);
  }
}

if (failures.length > 0) {
  console.error('Rendering parity audit failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Rendering parity audit passed for US/India routes and shared renderers.');
