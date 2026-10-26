import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@hospitality-os/ui', '@hospitality-os/utils', '@hospitality-os/types'],
  serverExternalPackages: ['@prisma/client', '@hospitality-os/database'],
  images: {
    unoptimized: true,
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('@prisma/client', '@hospitality-os/database');
      }
    }
    return config;
  },
};

export default nextConfig;
