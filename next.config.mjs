/** @type {import('next').NextConfig} */
const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080').replace(/\/+$/, '');

const nextConfig = {
  async rewrites() {
    return [
      {
        // Proxies /api/* to the backend so the browser never
        // needs to know the backend's real URL (also sidesteps CORS in dev).
        source: '/api/:path*',
        destination: `${baseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
