import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();

const pageFiles = [
  'app/page.tsx',
  'components/home/HomepageLayout.tsx',
  'app/in/page.tsx',
  'components/home/IndiaHomepageLayout.tsx',
  'app/in/blog/page.tsx',
  'app/in/blog/sip-vs-fd/page.tsx',
  'app/in/blog/ppf-vs-elss/page.tsx'
];

function read(filePath: string) {
  return fs.readFileSync(path.join(repoRoot, filePath), 'utf8');
}

function assertPageLinksAreStyled(filePath: string) {
  const source = read(filePath);
  const linkTags = source.match(/<Link\s+[^>]*>/g) ?? [];

  const unstyledLinks = linkTags.filter((tag) => !/className=/.test(tag));
  assert.equal(
    unstyledLinks.length,
    0,
    `${filePath} contains plain <Link> tags without explicit classes: ${unstyledLinks.join(' | ')}`
  );
}

export function runFinanceSphereRenderingSeoRegressionTests() {
  for (const filePath of pageFiles) {
    assertPageLinksAreStyled(filePath);
  }

  // India blog hub delegates link-card rendering to the IndiaBlogHub component
  const indiaBlogHubComponent = read('components/india/IndiaBlogHub.tsx');
  assert.match(indiaBlogHubComponent, /className=\"link-card[^\"]*\"/, 'India blog hub paths should render as styled link cards');

  // Article pages use IndiaArticleRenderer; inline-link-row is rendered by the component for nextDecisions
  const indiaArticleRenderer = read('components/india/IndiaArticleRenderer.tsx');
  assert.match(indiaArticleRenderer, /inline-link-row/, 'IndiaArticleRenderer should render adjacent link clusters with inline-link-row wrappers');

  const sipVsFd = read('app/in/blog/sip-vs-fd/page.tsx');
  const ppfVsElss = read('app/in/blog/ppf-vs-elss/page.tsx');
  assert.match(sipVsFd, /nextDecisions/, 'SIP vs FD page should declare nextDecisions clusters for inline-link-row rendering');
  assert.match(ppfVsElss, /nextDecisions/, 'PPF vs ELSS page should declare nextDecisions clusters for inline-link-row rendering');

  const interactiveArticleContent = read('components/blog/InteractiveArticleContent.tsx');
  assert.match(interactiveArticleContent, /className=\"inline-link-row\"/, 'Adjacent markdown links should render in a dedicated inline-link-row wrapper');
  assert.match(interactiveArticleContent, /className=\"content-link-chip\"/, 'Adjacent markdown links should render with chip styling');
  assert.match(interactiveArticleContent, /if \(line\.startsWith\('\\|'\)\)/, 'Markdown table rows should be explicitly parsed');
  assert.match(interactiveArticleContent, /<table className=\"comparison-table/, 'Markdown table parsing should render semantic table markup');

  const breadcrumbs = read('components/layout/Breadcrumbs.tsx');
  assert.match(breadcrumbs, /in:\s*'India'/, 'Breadcrumbs should map "in" route segment to "India"');
  assert.match(breadcrumbs, /blog:\s*'Blog'/, 'Breadcrumbs should map "blog" route segment to "Blog"');
  assert.ok(!breadcrumbs.includes("'/In'"), 'Breadcrumbs should not expose raw route-like labels such as /In');
  assert.ok(!breadcrumbs.includes("'/Blog'"), 'Breadcrumbs should not expose raw route-like labels such as /Blog');
}
