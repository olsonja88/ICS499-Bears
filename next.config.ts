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
};

export default nextConfig;
