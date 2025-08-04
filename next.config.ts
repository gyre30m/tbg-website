import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The `serverExternalPackages` option allows you to opt-out of bundling dependencies in your Server Components.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  webpack: (config) => {
    config.ignoreWarnings = [
      (warning: any) =>
        warning.message.includes('Critical dependency') &&
        warning.message.includes('realtime-js')
    ];
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
