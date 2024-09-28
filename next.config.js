/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig