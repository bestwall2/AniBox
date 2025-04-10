/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdna.artstation.com", // Optional: Specify hostname if needed
      },
      {
        protocol: "https",
        hostname: "s4.anilist.co", // Optional: Specify hostname if needed
      },
    ],
  },
};

export default nextConfig;
