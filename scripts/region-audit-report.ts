import { detectCrossRegionDuplicates } from './detect-cross-region-duplicates';
import { getRegionContentMap } from '@/lib/regionContentMap';
import { buildRegionAlternates } from '@/lib/regionSeo';

type RegionRoute = { route: string; region: 'US' | 'INDIA' };

function findOrphans(routes: RegionRoute[]) {
  const us = new Set(routes.filter((item) => item.region === 'US').map((item) => item.route));
  const india = new Set(routes.filter((item) => item.region === 'INDIA').map((item) => item.route));

  return {
    usOnly: [...us].filter((route) => !india.has(route)),
    indiaOnly: [...india].filter((route) => !us.has(route))
  };
}

function findSeoConflicts(routes: RegionRoute[]) {
  const conflicts: string[] = [];
  const pairs = new Map<string, Set<'US' | 'INDIA'>>();

  for (const route of routes) {
    const current = pairs.get(route.route) ?? new Set<'US' | 'INDIA'>();
    current.add(route.region);
    pairs.set(route.route, current);
  }

  for (const [route, regions] of pairs.entries()) {
    if (regions.has('US') && regions.has('INDIA')) {
      const usCanonical = buildRegionAlternates(route, 'US').canonical;
      const indiaCanonical = buildRegionAlternates(route, 'INDIA').canonical;
      if (usCanonical === indiaCanonical) {
        conflicts.push(`Canonical collision on ${route}: ${usCanonical}`);
      }
    }

    if (regions.has('US') !== regions.has('INDIA')) {
      conflicts.push(`Missing hreflang pair for ${route}; exists in only one region.`);
    }
  }

  return conflicts;
}

const isDirectRun = (process.argv[1] ?? '').includes('region-audit-report');

if (isDirectRun) {
  const { findings, routes } = detectCrossRegionDuplicates();
  const routeList: RegionRoute[] = routes.map((route) => ({ route: route.route, region: route.region }));
  const orphans = findOrphans(routeList);
  const seoConflicts = findSeoConflicts(routeList);
  const mappedSlugs = getRegionContentMap().map((entry) => `${entry.slug} => ${entry.region}`);

  console.log('=== Region Isolation Audit Report ===');
  console.log(`Mapped registry entries: ${mappedSlugs.length}`);
  console.log('');
  console.log('1) Duplicate pages across /us and /india');
  if (findings.length === 0) {
    console.log(' - None');
  } else {
    for (const finding of findings) {
      console.log(` - [${finding.severity}] ${finding.category}: ${finding.message}`);
    }
  }

  console.log('');
  console.log('2) Mixed terminology violations');
  const terminologyFindings = findings.filter((finding) => finding.category === 'TERMINOLOGY_MIX');
  if (terminologyFindings.length === 0) {
    console.log(' - None');
  } else {
    for (const finding of terminologyFindings) {
      console.log(` - ${finding.message}`);
    }
  }

  console.log('');
  console.log('3) SEO conflicts (canonical/hreflang mismatch)');
  if (seoConflicts.length === 0) {
    console.log(' - None');
  } else {
    for (const item of seoConflicts) {
      console.log(` - ${item}`);
    }
  }

  console.log('');
  console.log('4) Orphan pages (exists in one region only)');
  console.log(` - US only: ${orphans.usOnly.length ? orphans.usOnly.join(', ') : 'None'}`);
  console.log(` - INDIA only: ${orphans.indiaOnly.length ? orphans.indiaOnly.join(', ') : 'None'}`);

  process.exit(findings.some((finding) => finding.severity === 'CRITICAL') ? 1 : 0);
}
