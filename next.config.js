const blogRedirectMap = require('./content/audit/blog-redirect-map.json');

function normalizeRedirectMap(entries) {
  const firstBySource = new Map();

  for (const entry of entries) {
    if (!entry?.source || !entry?.destination) continue;
    if (!firstBySource.has(entry.source)) {
      firstBySource.set(entry.source, { source: entry.source, destination: entry.destination });
    }
  }

  const normalized = [];

  for (const [source, initial] of firstBySource.entries()) {
    const seen = new Set([source]);
    let destination = initial.destination;

    while (firstBySource.has(destination) && !seen.has(destination)) {
      seen.add(destination);
      destination = firstBySource.get(destination).destination;
    }

    if (seen.has(destination) || destination === source) continue;
    normalized.push({ source, destination });
  }

  return normalized;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO/performance: Next.js compression enables gzip/brotli in production.
  compress: true,
  // URL normalization: keep a single canonical path format (no trailing slash except root).
  trailingSlash: false,
  // Performance: keep JS/CSS minification enabled for production bundles.
  swcMinify: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  },

  async redirects() {
    const legacyCalculatorRedirects = [
      { source: '/mortgage-calculator', destination: '/calculators/mortgage-calculator' },
      { source: '/loan-emi-calculator', destination: '/calculators/loan-calculator' },
      { source: '/compound-interest-calculator', destination: '/calculators/compound-interest-calculator' },
      { source: '/retirement-calculator', destination: '/calculators/retirement-calculator' },
      { source: '/fire-retirement-calculator', destination: '/calculators/fire-calculator' },
      { source: '/net-worth-calculator', destination: '/calculators/net-worth-calculator' },
      { source: '/investment-growth-calculator', destination: '/calculators/investment-growth-calculator' },
      { source: '/savings-goal-calculator', destination: '/calculators/savings-goal-calculator' },
      { source: '/debt-payoff-calculator', destination: '/calculators/debt-payoff-calculator' }
    ];

    return [
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/us/compare', destination: '/us/comparison', permanent: true },
      { source: '/us/blog/tag', destination: '/us/blog', permanent: true },
      { source: '/compare/best-credit-cards-2026', destination: '/best-credit-cards-2026', permanent: true },
      { source: '/compare/best-investment-apps', destination: '/best-investment-apps', permanent: true },
      { source: '/compare/best-savings-accounts-usa', destination: '/best-savings-accounts-usa', permanent: true },
      { source: '/compare/high-yield-savings-accounts', destination: '/high-yield-savings-accounts', permanent: true },
      { source: '/best-credit-cards', destination: '/best-credit-cards-2026', permanent: true },
      { source: '/best-savings-accounts', destination: '/best-savings-accounts-usa', permanent: true },
      { source: '/mortgage-rate-comparison', destination: '/compare/mortgage-rate-comparison', permanent: true },
      { source: '/in/80c-deductions-guide', destination: '/in/80c-deductions', permanent: true },
      { source: '/in/tax-slabs-2026-india', destination: '/in/tax-slabs', permanent: true },
      { source: '/money-copilot', destination: '/ai-money-copilot', permanent: true },
      { source: '/compare', destination: '/comparison', permanent: true },
      { source: '/in/strategy-playbooks', destination: '/learn/strategy-playbooks', permanent: true },
      { source: '/in/calculators/debt-payoff-calculator', destination: '/calculators/debt-payoff-calculator', permanent: true },
      { source: '/in/calculators/retirement-calculator', destination: '/calculators/retirement-calculator', permanent: true },
      { source: '/blog/emergency-fund-guide', destination: '/blog/emergency-fund-target-by-recovery-timeline', permanent: true },
      { source: '/blog/401k-contribution-rate-sustainable-target-2026', destination: '/blog/pre-tax-vs-post-tax-contributions-simple', permanent: true },
      { source: '/blog/capital-gains-tax-strategy-0-percent-harvesting-2026', destination: '/blog/how-to-stay-in-a-lower-tax-bracket', permanent: true },
      { source: '/blog/cd-ladder-strategy-2026', destination: '/blog/how-to-choose-a-high-yield-savings-account', permanent: true },
      ...legacyCalculatorRedirects.map((entry) => ({ ...entry, permanent: true })),
      ...normalizeRedirectMap(blogRedirectMap).map((entry) => ({
        source: entry.source,
        destination: entry.destination,
        permanent: true
      }))
    ];
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|js|css)',
        headers: [
          // Performance: long-lived immutable cache for static assets.
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/:path*',
        headers: [
          // Performance: baseline compression/content negotiation hints.
          { key: 'Vary', value: 'Accept-Encoding' }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
