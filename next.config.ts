import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // The sandbox preview is proxied through this host; allow its dev resources to load.
  allowedDevOrigins: ['3000-i3ls773jrdtm035g6t8u9-5ac77255.us2.manus.computer'],
  // GitHub Pages serves from /indicadores/ subpath
  basePath: process.env.NODE_ENV === "production" ? "/indicadores" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
