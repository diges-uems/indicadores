import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // GitHub Pages serves from /indicadores/ subpath
  basePath: process.env.NODE_ENV === "production" ? "/indicadores" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
