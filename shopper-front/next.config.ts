import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
  output: "standalone",
};

export default nextConfig;
