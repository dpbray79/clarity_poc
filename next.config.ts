import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/clarity_poc',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
