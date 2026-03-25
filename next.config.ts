import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "4lbnzk45-5000.asse.devtunnels.ms",
      },
    ],
  },
};

export default nextConfig;
