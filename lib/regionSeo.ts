import { absoluteUrl } from '@/lib/seo';

export type RegionSeoRegion = 'US' | 'INDIA';

export function toRegionPath(contentPath: string, region: RegionSeoRegion): string {
  const normalized = contentPath === '/' ? '' : contentPath;
  return region === 'US' ? `/us${normalized}` : `/india${normalized}`;
}

export function buildRegionAlternates(contentPath: string, region: RegionSeoRegion) {
  const selfPath = toRegionPath(contentPath, region);
  const usPath = toRegionPath(contentPath, 'US');
  const indiaPath = toRegionPath(contentPath, 'INDIA');

  return {
    canonical: absoluteUrl(selfPath),
    languages: {
      'en-US': absoluteUrl(usPath),
      'en-IN': absoluteUrl(indiaPath),
      'x-default': absoluteUrl(usPath)
    }
  };
}
