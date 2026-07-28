import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8090",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3080",
      },
    ],
  },
};

export default nextConfig;
