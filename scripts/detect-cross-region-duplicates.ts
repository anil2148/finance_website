import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { findForeignRegionTerms } from '@/lib/terminologyLock';

type Region = 'US' | 'INDIA';
type Severity = 'ERROR' | 'CRITICAL';

type RouteRecord = {
  region: Region;
  route: string;
  sourceFile: string;
  text: string;
  normalizedText: string;
  hash: string;
  slug: string;
};

type DuplicateFinding = {
  severity: Severity;
  category: 'SAME_SLUG' | 'CONTENT_DUPLICATE' | 'TERMINOLOGY_MIX';
  message: string;
  suggestion: string;
  routes: string[];
};

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'app');

function walk(dir: string, collector: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      walk(full, collector);
      continue;
    }
    collector.push(full);
  }
  return collector;
}

function isRegionRoutePage(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, '/');
  return /\/app\/(us|india)\/.+\/page\.(tsx|ts|jsx|js)$/.test(normalized) || /\/app\/(us|india)\/page\.(tsx|ts|jsx|js)$/.test(normalized);
}

function getRoutePathFromFile(filePath: string): { region: Region; route: string } {
  const normalized = filePath.replace(/\\/g, '/');
  const match = normalized.match(/\/app\/(us|india)(\/.*)?\/page\.(tsx|ts|jsx|js)$/);

  if (!match) {
    throw new Error(`Cannot resolve route for ${filePath}`);
  }

  const region = match[1] === 'us' ? 'US' : 'INDIA';
  const suffix = (match[2] ?? '').replace(/\/\(.*?\)/g, '');
  const route = suffix ? suffix : '/';
  return { region, route };
}

function normalizeText(input: string): string {
  return input
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function similarityScore(a: string, b: string): number {
  const aSet = new Set(a.split(' ').filter(Boolean));
  const bSet = new Set(b.split(' ').filter(Boolean));
  if (aSet.size === 0 || bSet.size === 0) return 0;

  let overlap = 0;
  for (const token of aSet) {
    if (bSet.has(token)) overlap += 1;
  }
  return overlap / Math.max(aSet.size, bSet.size);
}

function fileToRecord(filePath: string): RouteRecord {
  const { region, route } = getRoutePathFromFile(filePath);
  const text = readFileSync(filePath, 'utf8');
  const normalizedText = normalizeText(text);
  const hash = createHash('sha256').update(normalizedText).digest('hex');
  const slug = route.split('/').filter(Boolean).at(-1) ?? '/';

  return {
    region,
    route,
    sourceFile: path.relative(ROOT, filePath),
    text,
    normalizedText,
    hash,
    slug
  };
}

export function detectCrossRegionDuplicates(): { findings: DuplicateFinding[]; routes: RouteRecord[] } {
  const files = walk(APP_DIR).filter(isRegionRoutePage);
  const routes = files.map(fileToRecord);
  const usRoutes = routes.filter((route) => route.region === 'US');
  const indiaRoutes = routes.filter((route) => route.region === 'INDIA');
  const findings: DuplicateFinding[] = [];

  for (const indiaRoute of indiaRoutes) {
    const violations = findForeignRegionTerms(indiaRoute.text, 'INDIA');
    if (violations.length > 0) {
      findings.push({
        severity: 'ERROR',
        category: 'TERMINOLOGY_MIX',
        message: `India route ${indiaRoute.route} contains US terminology (${violations.map((item) => item.term).join(', ')})`,
        suggestion: 'Rewrite copy using India-approved terms only.',
        routes: [indiaRoute.route]
      });
    }
  }

  for (const usRoute of usRoutes) {
    const violations = findForeignRegionTerms(usRoute.text, 'US');
    if (violations.length > 0) {
      findings.push({
        severity: 'ERROR',
        category: 'TERMINOLOGY_MIX',
        message: `US route ${usRoute.route} contains India terminology (${violations.map((item) => item.term).join(', ')})`,
        suggestion: 'Rewrite copy using US-approved terms only.',
        routes: [usRoute.route]
      });
    }
  }

  for (const usRoute of usRoutes) {
    for (const indiaRoute of indiaRoutes) {
      if (usRoute.slug === indiaRoute.slug && usRoute.slug !== '/') {
        findings.push({
          severity: 'CRITICAL',
          category: 'SAME_SLUG',
          message: `Slug collision detected: ${usRoute.slug}`,
          suggestion: 'Keep one owner, redirect the other route, or rename one slug.',
          routes: [usRoute.route, indiaRoute.route]
        });
      }

      const score = usRoute.hash === indiaRoute.hash ? 1 : similarityScore(usRoute.normalizedText, indiaRoute.normalizedText);
      if (score >= 0.7) {
        findings.push({
          severity: score > 0.9 ? 'CRITICAL' : 'ERROR',
          category: 'CONTENT_DUPLICATE',
          message: `Content similarity ${(score * 100).toFixed(1)}% between ${usRoute.route} and ${indiaRoute.route}`,
          suggestion: 'Remove duplication, redirect, or rewrite to region-specific intent/terminology.',
          routes: [usRoute.route, indiaRoute.route]
        });
      }
    }
  }

  return { findings, routes };
}

const isDirectRun = (process.argv[1] ?? '').includes('detect-cross-region-duplicates');

if (isDirectRun) {
  const { findings } = detectCrossRegionDuplicates();

  if (findings.length === 0) {
    console.log('✅ No cross-region duplicates or terminology violations found.');
    process.exit(0);
  }

  console.log('Cross-region duplicate audit report');
  for (const finding of findings) {
    console.log(`- [${finding.severity}] ${finding.category}: ${finding.message}`);
    console.log(`  Suggestion: ${finding.suggestion}`);
    console.log(`  Routes: ${finding.routes.join(' vs ')}`);
  }

  process.exit(1);
}
