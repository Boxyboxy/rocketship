/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  /* config options here */
  publicRuntimeConfig: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
