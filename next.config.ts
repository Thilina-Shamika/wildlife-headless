/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ceylonicus.local'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'ceylonicus.local',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
