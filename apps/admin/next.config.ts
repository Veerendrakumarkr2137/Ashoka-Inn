import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// Manually load the root .env file so that Next.js has access to it regardless of how it's started
const envPath = path.resolve(process.cwd(), "../../.env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  envConfig.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.length > 0 && (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  });
}

const nextConfig: NextConfig = {
  transpilePackages: ['@hospitality-os/ui', '@hospitality-os/utils', '@hospitality-os/types'],
  serverExternalPackages: ['@prisma/client', '@hospitality-os/database'],
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
