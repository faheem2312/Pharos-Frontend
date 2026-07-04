/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // Proxies /api/* to the Cloud Run backend so the browser never
        // needs to know the backend's real URL (also sidesteps CORS in dev).
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
