import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "pub-940ccf6255b54fa799a9b01050e6c227.r2.dev" },
      { hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com" },
      { hostname: "localhost" },
    ],
  },
};

export default nextConfig;
