/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Security Headers Configuration
   * These headers provide defense-in-depth security measures
   */
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          // Prevent clickjacking attacks
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Enable browser XSS filter
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Restrict browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
          },
          // TODO: Enable in production with proper configuration
          // Content Security Policy - currently commented to avoid breaking dev
          // {
          //   key: 'Content-Security-Policy',
          //   value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.supabase.co wss://*.supabase.co;"
          // }
        ]
      },
      {
        // API routes - stricter headers
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Prevent caching of sensitive API responses
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ]
      }
    ];
  },

  /**
   * Image optimization configuration
   * Whitelist allowed image domains
   */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Add other trusted image hosts here
    ],
  },

  /**
   * Experimental features
   */
  experimental: {
    // Enable server actions (already stable in Next 14)
    serverActions: {
      bodySizeLimit: '2mb', // Limit request body size
    },
  },

  /**
   * Logging configuration
   */
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV !== 'production',
    },
  },

  /**
   * PoweredBy header - hide Next.js version
   */
  poweredByHeader: false,
};

export default nextConfig;
