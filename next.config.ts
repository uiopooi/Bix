import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
        ],
      },
    ];
  },
  
  // Disable strict mode for development
  reactStrictMode: false,
  
  // Ensure output is static and can be served from any path
  output: 'standalone',
  
  // Disable image optimization for simplicity
  images: {
    unoptimized: true,
  },
  
  // Ensure the app works when accessed from a subdirectory
  basePath: '',
  assetPrefix: '',
};

export default nextConfig;
