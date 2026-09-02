import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sequelize"],
  // Pin the workspace root: without this Turbopack walks up and picks up a
  // stray package-lock.json in the home directory.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
