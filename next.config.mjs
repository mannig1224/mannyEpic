/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignore ESLint errors during production builds
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    // Ignore TypeScript errors during production builds
    ignoreBuildErrors: true,
  },
    // This function is used to modify Webpack's configuration in Next.js
  webpack: (config, { isServer, webpack }) => {
    // Use the webpack object provided by Next.js
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /canvas|jsdom/, // Ignore the `canvas` and `jsdom` modules
        contextRegExp: /konva/, // Only apply this rule within the `konva` module
      })
    );

    if (!isServer) {
      // Fallback configuration for modules that are only available in Node.js
      config.resolve.fallback = {
        ...config.resolve.fallback, // Retain existing fallbacks
        fs: false, // Ignore the `fs` module on the client side
        path: false, // Ignore the `path` module on the client side (if needed)
        os: false, // Ignore the `os` module on the client side (if needed)
      };
    }

    // Return the modified config to Next.js
    return config;
  },
};

// Export the modified configuration to be used by Next.js
export default nextConfig;