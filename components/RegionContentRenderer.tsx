import { InteractiveArticleContent } from '@/components/blog/InteractiveArticleContent';
import { transformFinancialTerms } from '@/lib/transformFinancialTerms';
import type { BlogRegion } from '@/lib/financialTerms';
import { enforceTerminologyLock } from '@/lib/terminologyLock';

type RegionContentRendererProps = {
  content: string;
  region: BlogRegion;
  calculatorHref: string;
  calculatorLabel: string;
};

export function RegionContentRenderer({ content, region, calculatorHref, calculatorLabel }: RegionContentRendererProps) {
  const transformedContent = transformFinancialTerms(content, region);
  const lockedContent = enforceTerminologyLock(transformedContent, region, 'autocorrect');

  return (
    <InteractiveArticleContent
      content={lockedContent}
      calculatorHref={calculatorHref}
      calculatorLabel={calculatorLabel}
    />
  );
}
