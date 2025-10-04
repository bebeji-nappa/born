/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["ahooks"],
  serverExternalPackages: ["jose", "@panva/hkdf", "openid-client"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "storage.born-docs.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "staging-storage.born-docs.com",
        port: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
    ],
  },
};

export default nextConfig;
