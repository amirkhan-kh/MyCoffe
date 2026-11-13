import type { NextConfig } from "next";

const WEEK = 60 * 60 * 24 * 7;
const YEAR = 60 * 60 * 24 * 365;

const nextConfig: NextConfig = {
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    minimumCacheTTL: YEAR,
  },
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    // Scene and brand files keep their names across deploys, so browsers revalidate weekly
    // while the edge holds them until the next deploy.
    const longCache = [{ key: "Cache-Control", value: `public, max-age=${WEEK}, stale-while-revalidate=${YEAR}` }];
    return [
      { source: "/:path*", headers: security },
      { source: "/scenes/:file*", headers: longCache },
      { source: "/brand/:file*", headers: longCache },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
