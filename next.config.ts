import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pub-b6b67b2357b74ec69ea57e3ed858a264.r2.dev" },
      { protocol: "https", hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "sillage-back-production.up.railway.app" },
      { protocol: "https", hostname: "sillageparfumerie-admin.melone.info" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "localhost", port: "9002" },
    ],
    // Allows fetching from local MinIO (loopback IP), blocked by Next's SSRF guard otherwise.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
};

export default nextConfig;
