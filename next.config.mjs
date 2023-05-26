import "./app/env.mjs";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  cleanDistDir: false,
  webpack: (config) => {
    config.experiments.asyncWebAssembly = true;

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
