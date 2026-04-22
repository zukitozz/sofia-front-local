/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.resolve.fallback = {
        ...config.resolve.fallback, // Add existing fallbacks
        dgram: false, // Ignore 'dgram' module for client-side
      };
      return config;
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'utfs.io',
        },
      ],
    },    
}

module.exports = nextConfig
