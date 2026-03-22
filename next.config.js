const blogRedirectMap = require('./content/audit/blog-redirect-map.json');

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
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'financesphere.io' }],
        destination: 'https://www.financesphere.io/:path*',
        permanent: true
      },
      ...legacyCalculatorRedirects.map((entry) => ({ ...entry, permanent: true })),
      ...blogRedirectMap.map((entry) => ({
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
