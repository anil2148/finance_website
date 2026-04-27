'use client';

import { useRegion } from '@/components/providers/RegionProvider';
import { getFinanceTerms } from '@/lib/finance-terminology';

export function GeoDisclaimer() {
  const { region, config } = useRegion();
  const terms = getFinanceTerms(region);

  return (
    <aside className="mx-auto mt-4 max-w-7xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
      <p className="font-semibold">Regional disclaimer ({config.label})</p>
      <p className="mt-1">
        FinanceSphere content is educational and localized for {config.label}. Terminology on this view follows {terms.accounting_standard}, {terms.tax_authority}, {terms.tax_framework}, and market labels such as {terms.mortgage} and {terms.checking_account}. Verify final compliance with a licensed advisor in your jurisdiction.
      </p>
    </aside>
  );
}
