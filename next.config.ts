import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ["images.unsplash.com"],
    },
    allowedDevOrigins: ["https://images.unsplash.com"],
};

export default nextConfig;
