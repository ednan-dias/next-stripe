/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["files.stripe.com"],
    loader: "akamai",
    path: "",
  },
};

module.exports = nextConfig;
