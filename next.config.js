/** @type {import('next').NextConfig} */
const path = require('node:path');
const webpack = require("webpack");

module.exports = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    const nodeBackend = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:6050";
    return [
      {
        source: "/api/visitors/:path*",
        destination: `${nodeBackend}/visitors/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  webpack: (config, _context) => {
    config.resolve.fallback = { fs: false };
    config.resolve.alias['jotai'] = path.resolve(__dirname, 'node_modules/jotai')
    
    // Alias for problematic anchor imports
    config.resolve.alias['@coral-xyz/anchor/dist/cjs/utils/bytes'] = path.resolve(__dirname, 'node_modules/@coral-xyz/anchor/dist/esm/utils/bytes')

    // Exclude undici from webpack processing to avoid build errors
    config.externals = config.externals || [];
    config.externals.push('undici');

    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      }),
    );

    return config;
  },
};
