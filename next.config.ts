/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ❌ Ne pas utiliser "output: export" ici
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
