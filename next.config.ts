/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.NEXT_PUBLIC_WORDPRESS_DOMAIN || 'ceylonicus.local'],
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_WORDPRESS_PROTOCOL || 'http',
        hostname: process.env.NEXT_PUBLIC_WORDPRESS_DOMAIN || 'ceylonicus.local',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
