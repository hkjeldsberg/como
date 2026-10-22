import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev access from other hosts (second local player, phones on the LAN).
  allowedDevOrigins: ["127.0.0.1", "192.168.*.*"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
