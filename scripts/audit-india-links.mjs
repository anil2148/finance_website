import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const indiaAppDir = path.join(root, 'app', 'in');
const indiaComponentsDir = path.join(root, 'components', 'india');

const requiredRegressionPages = [
  'app/page.tsx',
  'app/blog/page.tsx',
  'app/in/page.tsx',
  'app/in/blog/page.tsx',
  'app/in/blog/sip-vs-fd/page.tsx',
  'app/in/blog/ppf-vs-elss/page.tsx'
];

const allowedLinkTokens = ['content-link', 'content-link-chip', 'utility-link', 'link-card', 'underline', 'prose-a:', 'btn-primary', 'comparison-cta'];
const requiredClassTokens = ['content-link', 'content-link-chip', 'utility-link', 'link-card', 'btn-primary', 'comparison-cta'];
const routeSourceChecks = [
  { route: '/in', file: 'app/in/page.tsx' },
  { route: '/in/blog', file: 'app/in/blog/page.tsx' },
  { route: '/in/blog/sip-vs-fd', file: 'app/in/blog/sip-vs-fd/page.tsx' },
  { route: '/in/blog/ppf-vs-elss', file: 'app/in/blog/ppf-vs-elss/page.tsx' },
  { route: '/', file: 'app/page.tsx' },
  { route: '/blog', file: 'app/blog/page.tsx' }
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    if (entry.isFile() && full.endsWith('.tsx')) files.push(full);
  }
  return files;
}

function relative(filePath) {
  return path.relative(root, filePath).replace(/\\/g, '/');
}

const failures = [];

for (const regressionPage of requiredRegressionPages) {
  if (!fs.existsSync(path.join(root, regressionPage))) {
    failures.push(`[missing-regression-page] ${regressionPage}`);
  }
}

for (const check of routeSourceChecks) {
  if (!fs.existsSync(path.join(root, check.file))) {
    failures.push(`[missing-route-source] ${check.route} -> ${check.file}`);
  }
}

const allFiles = [...walk(indiaAppDir), ...walk(indiaComponentsDir)];

for (const file of allFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const rel = relative(file);

  const linkTags = [...source.matchAll(/<(Link|a)\b([^>]*?)>/g)];
  for (const tag of linkTags) {
    const attrs = tag[2] ?? '';
    const classMatch = attrs.match(/className=(?:"([^"]+)"|'([^']+)')/);
    const classValue = classMatch?.[1] ?? classMatch?.[2] ?? '';

    const isStyled = allowedLinkTokens.some((token) => classValue.includes(token));
    const hasBodyToneOnly = classValue.includes('text-slate') && !classValue.includes('hover:underline') && !classValue.includes('content-link');
    const intentionallyButtonLike = classValue.includes('rounded-') || classValue.includes('bg-');

    if (hasBodyToneOnly && !isStyled && !intentionallyButtonLike) {
      failures.push(`[weak-link-style] ${rel} :: ${tag[0]}`);
    }

    if (!classValue) {
      failures.push(`[missing-link-class] ${rel} :: ${tag[0]}`);
    }

    if (classValue && !requiredClassTokens.some((token) => classValue.includes(token)) && !classValue.includes('underline')) {
      failures.push(`[link-not-using-shared-token] ${rel} :: ${tag[0]}`);
    }
  }

  const compactAdjacentLinks = /<\/(Link|a)>\s*<(Link|a)\b/g.test(source);
  const hasSpacingGroup = source.includes('india-link-cluster') || source.includes('gap-') || source.includes('space-x-') || source.includes('space-y-');
  if (compactAdjacentLinks && !hasSpacingGroup) {
    failures.push(`[adjacent-links-without-spacing] ${rel}`);
  }

  const hasMarkdownPipeTable = /(^|\n)\|.+\|(\n|$)/m.test(source);
  const hasRealTableMarkup = /<table\b/.test(source);
  if (hasMarkdownPipeTable && !hasRealTableMarkup && rel.includes('app/in/blog/')) {
    failures.push(`[markdown-table-not-rendered] ${rel}`);
  }

}

const cssFile = path.join(root, 'styles', 'globals.css');
if (!fs.existsSync(cssFile)) {
  failures.push('[missing-file] styles/globals.css');
} else {
  const css = fs.readFileSync(cssFile, 'utf8');
  const requiredTokens = ['.editorial-content', '.content-link', '.content-link-chip', '.link-card', '.breadcrumb-link', '.breadcrumb-current', '.comparison-table'];
  for (const token of requiredTokens) {
    if (!css.includes(token)) failures.push(`[missing-token] styles/globals.css :: ${token}`);
  }
}

const breadcrumbFile = path.join(root, 'components', 'layout', 'Breadcrumbs.tsx');
if (!fs.existsSync(breadcrumbFile)) {
  failures.push('[missing-file] components/layout/Breadcrumbs.tsx');
} else {
  const breadcrumbsSource = fs.readFileSync(breadcrumbFile, 'utf8');
  const requiredBreadcrumbTokens = ['Home', 'India', 'breadcrumbLabelMap'];
  for (const token of requiredBreadcrumbTokens) {
    if (!breadcrumbsSource.includes(token)) {
      failures.push(`[breadcrumb-label-missing] components/layout/Breadcrumbs.tsx :: ${token}`);
    }
  }
  if (!breadcrumbsSource.includes('aria-current="page"')) {
    failures.push('[breadcrumb-a11y-missing] components/layout/Breadcrumbs.tsx');
  }
}

if (failures.length > 0) {
  console.error('India link UX audit failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`India link UX audit passed (${allFiles.length} India TSX files scanned).`);
