import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/login", // Change to your desired page
        permanent: false, // Set to false if it's a temporary redirect
      },
    ];
  },
};

export default nextConfig;
