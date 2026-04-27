import { InteractiveArticleContent } from '@/components/blog/InteractiveArticleContent';
import { transformFinancialTerms } from '@/lib/transformFinancialTerms';
import type { BlogRegion } from '@/lib/financialTerms';

type RegionContentRendererProps = {
  content: string;
  region: BlogRegion;
  calculatorHref: string;
  calculatorLabel: string;
};

export function RegionContentRenderer({ content, region, calculatorHref, calculatorLabel }: RegionContentRendererProps) {
  const transformedContent = transformFinancialTerms(content, region);

  return (
    <InteractiveArticleContent
      content={transformedContent}
      calculatorHref={calculatorHref}
      calculatorLabel={calculatorLabel}
    />
  );
}
