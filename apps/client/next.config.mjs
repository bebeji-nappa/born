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
        hostname: "storage.bebeji-nappa.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "storage-staging.bebeji-nappa.com",
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
