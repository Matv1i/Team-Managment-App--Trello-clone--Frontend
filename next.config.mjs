import { hostname } from "os"

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pm-s3-bucket-12er3te.s3.eu-north-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig

//https://pm-s3-bucket-12er3te.s3.eu-north-1.amazonaws.com/logo.png
