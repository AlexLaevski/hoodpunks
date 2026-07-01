import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      {
        source: "/api/metadata/:tokenId.json",
        destination: "/api/metadata/:tokenId",
      },
    ];
  },
};

export default nextConfig;
