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
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org', // 🟢 Allow Wikipedia Images
        port: '',
        pathname: '/wikipedia/commons/**', // ✅ Allows all Wikipedia images
        search: '',
      },
    ],
  },
};

export default nextConfig;
