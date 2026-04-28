import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimal config — no image domains needed (zero local assets)
  // All fonts loaded via next/font/google (tree-shaken, no external requests at runtime)
  reactStrictMode: true,
};

export default nextConfig;
