const API_BASE = process.env.API_BASE || "http://localhost:3002";
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_BASE}/:path*` }];
  },
};
export default nextConfig;
