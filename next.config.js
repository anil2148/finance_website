const blogRedirectMap = require('./content/audit/blog-redirect-map.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO/performance: Next.js compression enables gzip/brotli in production.
  compress: true,
  // Performance: keep JS/CSS minification enabled for production bundles.
  swcMinify: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  },

  async redirects() {
    return blogRedirectMap.map((entry) => ({
      source: entry.source,
      destination: entry.destination,
      permanent: true
    }));
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
