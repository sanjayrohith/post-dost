/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['genkit'],
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'picsum.photos'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Enable support for the src directory
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Support for TypeScript path mapping
  outputFileTracingRoot: __dirname,
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  images: {
  domains: ['images.unsplash.com', 'via.placeholder.com', 'picsum.photos', 'example.com'], // added
  dangerouslyAllowSVG: true,
  contentDispositionType: 'attachment',
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
},
}

module.exports = nextConfig