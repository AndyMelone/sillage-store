import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pub-940ccf6255b54fa799a9b01050e6c227.r2.dev" },
      { protocol: "https", hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "sillage-back-production.up.railway.app" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
