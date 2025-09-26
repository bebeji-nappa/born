/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'ahooks',
  ],
  serverExternalPackages: [
    'jose',
    '@panva/hkdf',
    'openid-client',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
    ],
  },
}

export default nextConfig;
