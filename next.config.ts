import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        API_URL: process.env.API_URL,
        WS_URL: process.env.WS_URL
    },
};

export default nextConfig;
