import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'olsonja88.github.io',
        port: '',
        pathname: '/ICS499-Bears/assets/**',
        search: '',
      },
    ],
  },
  // Disable ESLint during the build process
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
