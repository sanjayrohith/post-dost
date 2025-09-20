/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'picsum.photos'],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Enable support for the src directory
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Support for TypeScript path mapping
  outputFileTracingRoot: __dirname,
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig