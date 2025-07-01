import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.ignoreWarnings = [
      (warning: any) =>
        warning.message.includes('Critical dependency') &&
        warning.message.includes('realtime-js')
    ];
    return config;
  },
};

export default nextConfig;
