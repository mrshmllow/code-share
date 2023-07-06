import "./app/env.mjs";
import bundleAnalyzer from "@next/bundle-analyzer";
import migrate from "./db/migrate.mjs";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

let migrated = false;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer && !migrated) {
      migrate();
      migrated = true;
    }

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      }
    ]
  }
};

export default withBundleAnalyzer(nextConfig);
