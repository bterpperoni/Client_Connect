// @ts-nocheck
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  serverExternalPackages: ['@prisma/client', 'bcrypt'],
};

export default nextConfig;
