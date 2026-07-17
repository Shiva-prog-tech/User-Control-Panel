import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    // includePaths covers the legacy sass API, loadPaths the modern one.
    includePaths: [path.join(process.cwd(), "styles")],
    loadPaths: [path.join(process.cwd(), "styles")],
  },
};

export default nextConfig;
