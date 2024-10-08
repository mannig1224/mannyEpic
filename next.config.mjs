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
    webpack: (config, { webpack }) => {
      // Use the webpack object provided by Next.js
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /canvas|jsdom/, // Ignore the `canvas` and `jsdom` modules
          contextRegExp: /konva/, // Only apply this rule within the `konva` module
        })
      );
      
      // Return the modified config to Next.js
      return config;
    },
  };
  
  // Export the modified configuration to be used by Next.js
  export default nextConfig;