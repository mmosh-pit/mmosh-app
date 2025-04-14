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

    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      }),
    );

    return config;
  },
};
