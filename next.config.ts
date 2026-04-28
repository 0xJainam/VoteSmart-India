import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Firebase Spark (free) hosting — no server needed
  output: "export",
  // next/image requires a server for optimization; disable for static export
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
