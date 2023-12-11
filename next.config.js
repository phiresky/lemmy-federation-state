/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/lemmy-federation-state",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
