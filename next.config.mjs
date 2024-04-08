/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
