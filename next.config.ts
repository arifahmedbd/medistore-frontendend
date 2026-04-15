import type { NextConfig } from "next";
import "./src/env";

const nextConfig: NextConfig = {
  images: {
    domains: ["source.unsplash.com", "images.unsplash.com"],
  },
  reactCompiler: true,

  // better-auth proxy
  async rewrites() {
    return [
      {
        // Explicitly map auth requests
        source: "/api/auth/:path*",
        destination: process.env.BACKEND_URL + "/api/auth/:path*",
      },
      {
        // Explicitly map v1 API requests
        source: "/api/v1/:path*",
        destination: process.env.BACKEND_URL + "/api/v1/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
