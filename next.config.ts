/* import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig; */

import type { NextConfig } from "next";

// Pekar på din backend i prod. Lokalt kör du 3002 som innan.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3002";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE}/:path*`,
      },
    ];
  },
};

export default nextConfig;
