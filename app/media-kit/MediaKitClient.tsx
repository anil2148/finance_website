'use client';

import { useRef } from 'react';
import { DownloadPdfButton } from '@/components/pdf/DownloadPdfButton';

const adProducts = [
  {
    name: 'Sponsored article',
    placement: 'Homepage + blog feature slot (30 days)',
    rate: '$2,500'
  },
  {
    name: 'Newsletter feature',
    placement: 'Dedicated module in weekly newsletter',
    rate: '$1,100'
  },
  {
    name: 'Calculator sponsorship',
    placement: 'Contextual partner card in calculator flows',
    rate: '$1,800'
  }
];

export function MediaKitClient() {
  const mediaKitRef = useRef<HTMLElement>(null);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">FinanceSphere Media Kit</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Download a print-ready PDF with our partnership formats, placement options, and contact details.
          </p>
        </div>
        <DownloadPdfButton
          targetRef={mediaKitRef}
          calculatorTitle="FinanceSphere Media Kit"
          fileName="financesphere-media-kit.pdf"
        />
      </div>

      <article
        ref={mediaKitRef}
        className="space-y-8 rounded-xl border border-gray-200 bg-white p-8 text-gray-900 shadow-sm"
      >
        <header className="space-y-2 border-b border-gray-200 pb-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Updated March 2026</p>
          <h2 className="text-2xl font-bold">Reach financially active U.S. consumers</h2>
          <p className="text-sm text-gray-600">
            FinanceSphere is focused on helping people compare financial options, use practical calculators, and make
            clearer money decisions.
          </p>
        </header>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Audience focus</h3>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
              <li>People comparing mortgages, loans, savings, and investing paths.</li>
              <li>Users planning major decisions with calculators and educational guides.</li>
              <li>Readers looking for clear explanations of long-term financial tradeoffs.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Advertising opportunities</h3>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Placement</th>
                  <th className="px-4 py-3 font-semibold">Starting rate</th>
                </tr>
              </thead>
              <tbody>
                {adProducts.map((product) => (
                  <tr key={product.name} className="border-t border-gray-200">
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-gray-600">{product.placement}</td>
                    <td className="px-4 py-3">{product.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-semibold">Why brands partner with us</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
            <li>Context built around practical finance questions and decision-making moments.</li>
            <li>Contextual placements across calculators and comparison pages.</li>
            <li>Editorial standards that prioritize trust, transparency, and disclosures.</li>
          </ul>
        </section>

        <footer className="border-t border-gray-200 pt-4 text-sm">
          <p className="font-semibold">Partnership contact</p>
          <p>
            Email <span className="font-medium">partnerships@financesphere.io</span> to request custom bundles,
            category exclusivity, or performance-based campaigns.
          </p>
        </footer>
      </article>
    </section>
  );
}
