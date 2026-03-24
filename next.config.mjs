import BuilderDevTools from "@builder.io/dev-tools/next";

/** @type {import('next').NextConfig} */
const nextConfig = BuilderDevTools()({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bezaleelgroup.ca",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "royalhavencms.bezaleelgroup.ca",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "*.bezaleelgroup.ca",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Removed X-Frame-Options: SAMEORIGIN blocks Builder.io because app.builder.io is cross-origin.
          // Using Content-Security-Policy frame-ancestors instead to allow Builder.io specifically.
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://builder.io https://*.builder.io http://localhost:*;",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy", // Camera/Mic strictness
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
});

export default nextConfig;
