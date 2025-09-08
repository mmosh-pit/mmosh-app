/** @type {import('next').NextConfig} */
const path = require('node:path');
const webpack = require("webpack");

module.exports = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
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
