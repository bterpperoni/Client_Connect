/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Ajouter un loader pour les fichiers HTML si nécessaire
    config.module.rules.push({
      test: /\.html$/,
      use: ['html-loader'],
    });

    // Exclure certains packages du bundling si nécessaire
    config.externals = config.externals || [];

    return config;
  },
};

export default nextConfig;
