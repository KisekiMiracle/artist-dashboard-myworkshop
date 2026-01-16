import Icons from "@iconify/unplugin/webpack";
import type { NextConfig } from "next";

const hostnames = [
  "lh3.googleusercontent.com",
  "avatars.githubusercontent.com",
  "picsum.photos",
];

const nextConfig: NextConfig = {
  reactStrictMode: false,
  turbopack: {},
  images: {
    remotePatterns: hostnames.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
  webpack: (config) => {
    config.plugins.push(
      Icons({
        compiler: "react",
        css: "module",
      }),
      // Icons({
      //   compiler: "raw",
      //   namespace: "iconify-raw",
      //   mode: "svg",
      // })
    );
    return config;
  },
};

export default nextConfig;
