/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
    unoptimized: true
  },
  // Remove env section - use environment variables directly
}

module.exports = nextConfig